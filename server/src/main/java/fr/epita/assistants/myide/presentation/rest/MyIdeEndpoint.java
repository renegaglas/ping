package fr.epita.assistants.myide.presentation.rest;


import java.net.URI;

import fr.epita.assistants.MyIde;
import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.domain.service.MyProjectService;
import fr.epita.assistants.myide.domain.service.ProjectService;
import fr.epita.assistants.myide.utils.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.ResponseBuilder;
import jakarta.ws.rs.core.UriBuilder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Path("/api")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class MyIdeEndpoint {
    private MyIde ide = new MyIde();
    @GET @Path("/hello")
    public Response helloWorld()
    {
        Logger.log("Saying hello !");
        return Response.ok("Hello World !")
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
            .header("Access-Control-Allow-Headers", "Content-Type")
            .build();
    }

    @OPTIONS
    @Path("/open/project")
    public Response optionsOpenProject() {
        return Response.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .build();
    }
    @POST @Path("/open/project")
    public Response open_project(PathRequest request) {
        Logger.log("Opening project " + request.path);
        try {
            ide.project = ide.load_project(request.path);
            Logger.log("Project " + request.path + " loaded successfully");
            return Response.ok("{\"project\":\"" + request.path + "\"}")
                    .header("Access-Control-Allow-Origin", "*")
                    .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                    .header("Access-Control-Allow-Headers", "Content-Type")
                    .build();
        } catch (Exception e) {
            Logger.logError("Invalid project" + request.path);
            return Response.status(420).entity(new MyErrorResponse("Invalid project " + request.path)).build();
        }
    }


    @OPTIONS
    @Path("/open/file")
    public Response optionsOpenFile() {
        return Response.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .build();
    }

   @POST
    @Path("/open/file")
    public Response open_file(PathRequest request) {
        Logger.log("Received a request to open the file " + request.path);
        try {
            String content = ide.open_file(request.path);
            Logger.log("Opening and sending the file " + request.path);
            return Response.ok()
                    .entity(content)
                    .header("Access-Control-Allow-Origin", "*")
                    .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                    .header("Access-Control-Allow-Headers", "Content-Type")
                    .build();
        } catch (Exception e) {
            Logger.logError("File opening failed, the file is " + request.path);
            return Response.status(420).entity(new MyErrorResponse("File opening failed " + request.path)).build();
        }
    }
    
    @POST @Path("/create/file")
    public Response create_file(PathRequest request) {
        if (ide.project == null) {
            Logger.log("Client hasn't loaded a project yet and tried to create " + request.path);
            Logger.logError("Client hasn't loaded a project yet and tried to create " + request.path);
            return Response.status(420).entity(new MyErrorResponse("Project is null.")).build();
        }
        Logger.log("Creating a file " + request.path);
        try {
            return Response.ok(ide.create_file(request.path)).build();
        } catch (Exception e) {
            Logger.logError("File creation failed" + request.path);
            return Response.status(420).entity(new MyErrorResponse("File creation failed " + request.path)).build();
        }
    }
    @POST @Path("/create/folder")
    public Response create_folder(PathRequest request) {
        if (ide.project == null) {
            Logger.log("Client hasn't loaded a project yet and tried to create " + request.path);
            Logger.logError("Client hasn't loaded a project yet and tried to create " + request.path);
            return Response.status(420).entity(new MyErrorResponse("Project is null.")).build();
        }
        Logger.log("Creating a folder.");
        try {
            return Response.ok(ide.create_file(request.path)).build();
        } catch (Exception e) {
            Logger.logError("Folder creation failed" + request.path);
            return Response.status(420).entity(new MyErrorResponse("Folder creation failed " + request.path)).build();
        }
    }
    @POST @Path("/delete/file")
    public Response delete_file(PathRequest request) {
        if (ide.project == null) {
            Logger.log("Client hasn't loaded a project yet and tried to delete " + request.path);
            Logger.logError("Client hasn't loaded a project yet and tried to delete " + request.path);
            return Response.status(420).entity(new MyErrorResponse("Project is null.")).build();
        }
        Logger.log("Deleting a file " + request.path);
        boolean del = ide.delete_file(request.path);
        if (!del) {
            Logger.logError("Deletion failed " + request.path);
            return Response.status(420).entity(new MyErrorResponse("Deletion failed.")).build();
        }
        return Response.ok(true).build();
    }
    @POST @Path("/delete/folder")
    public Response delete_folder(PathRequest request) {
        if (ide.project == null) {
            Logger.log("Client hasn't loaded a project yet " + request.path);
            Logger.logError("Client hasn't loaded a project yet " + request.path);
            return Response.status(420).entity(new MyErrorResponse("Project is null.")).build();
        }
        Logger.log("Deleting a folder " + request.path);
        boolean del = ide.delete_folder(request.path);
        if (!del) {
            Logger.logError("Deletion failed " + request.path);
            return Response.status(420).entity(new MyErrorResponse("Deletion failed.")).build();
        }
        return Response.ok(true).build();
    }

    @POST @Path("/execFeature")
    public Response exec_feature(ExecRequest request) {
        Logger.log("Executing a feature " + request.feature + request.project + request.params);
        Feature.ExecutionReport res = ide.execute_feature(request.feature, request.params, request.project);
        if (res == null) {
            Logger.logError("Unsupported feature for the project" + request.feature + request.project + request.params);
            return Response.status(420).entity(new MyErrorResponse("Unsupported feature for the project.")).build();
        }
        return Response.ok(res).build();
    }
    @POST @Path("/move")
    public Response move(MoveRequest request) {
        if (ide.project == null) {
            Logger.log("Client hasn't loaded a project yet " + request.src + request.dst);
            return Response.status(420).entity(new MyErrorResponse("Project is null.")).build();
        }
        Logger.log("Moving a node " + request.src + request.dst);
        Node moved = ide.move(request.src, request.dst);
        if (moved == null) {
            Logger.logError("Moving failed " + request.src + request.dst);
            return Response.status(420).entity(new MyErrorResponse("Moving failed.")).build();
        }
        return Response.ok(moved).build();
    }

    @POST @Path("/update")
    public Response update(UpdateRequest request) {
        if (ide.project == null) {
            Logger.log("Client hasn't loaded a project yet " + request.path + request.to + request.from + request.content);
            Logger.logError("Client hasn't loaded a project yet " + request.path + request.to + request.from + request.content);
            return Response.status(420).entity(new MyErrorResponse("Project is null.")).build();
        }
        Logger.log("Updating a node" + request.path + request.to + request.from + request.content);
        Node updated = ide.update(request.path, request.from, request.to, request.content);
        if (updated == null) {
            Logger.logError("Updating failed " + request.path + request.to + request.from + request.content);
            return Response.status(420).entity(new MyErrorResponse("Updating failed.")).build();
        }
        return Response.ok(updated).build();
    }

    @OPTIONS
    @Path("/load")
    public Response optionsLoadTurt() {
        return Response.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .build();
    }
    @POST @Path("/load")
    public Response load_turt(PathRequest pathRequest) {
        if (ide.project == null) {
            Logger.log("Client hasn't loaded a project yet and tried to create " + pathRequest.path);
            Logger.logError("Client hasn't loaded a project yet and tried to create " + pathRequest.path);
            return Response.status(420).entity(new MyErrorResponse("Project is null.")).build();
        }
        String content = ide.load_turt_file(pathRequest.path);
        return Response.ok(content).header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type").build();
    }

    @OPTIONS
    @Path("/save")
    public Response optionsSaveTurt() {
        return Response.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type")
                .build();
    }
    @POST @Path("/save")
    public Response save_turt(SaveTurtRequest saveTurtRequest) {
        if (ide.project == null) {
            Logger.log("Client hasn't loaded a project yet and tried to create " + saveTurtRequest.name);
            Logger.logError("Client hasn't loaded a project yet and tried to create " + saveTurtRequest.name);
            return Response.status(420).entity(new MyErrorResponse("Project is null.")).build();
        }
        boolean res = ide.save_turt_file(saveTurtRequest.name, saveTurtRequest.commands);

        if (!res) {
            return Response.status(500).build();
        }

        return Response.ok().header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type").build();
    }
}