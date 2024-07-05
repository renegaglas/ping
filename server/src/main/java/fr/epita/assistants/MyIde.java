package fr.epita.assistants;

import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.domain.service.MyNodeService;
import fr.epita.assistants.myide.domain.service.MyProjectService;
import fr.epita.assistants.myide.domain.service.ProjectService;
import fr.epita.assistants.myide.utils.Given;
import fr.epita.assistants.myide.utils.Logger;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriBuilder;
import jakarta.ws.rs.core.Response.ResponseBuilder;
import lombok.NoArgsConstructor;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.net.URI;

/**
 * Starter class, we will use this class and the init method to get a
 * configured instance of {@link ProjectService}.
 */
@Given(overwritten = false)
public class MyIde {
    public ProjectService project_service;
    public Project project;

    public MyIde() {
        project_service = init();
    }

    // checkout the file to get the last saved state and return its content
    // returns: the content of the file once checked-out
    public String load_turt_file(String filename) {
        // /!\ for the moment, we suppose filename exists

        // we execute the checkout so that the file goes back to the last saved state
        project.getFeature(GitFeature.OurGit.CHECKOUT).get().execute(project, filename);
        Logger.log("We are trying to load the file " + filename);

        // we get the file
        File file = ((MyProject) project).getRootNode().getPath().resolve(filename).toFile();
        Logger.log("The file to load is " + file.toString());

        // we get the contents of it
        String content = "";
        BufferedReader br;
        try {
            br = new BufferedReader(new FileReader(file));
        }
        catch (Exception e) {
            e.printStackTrace();
            Logger.log("Couldn't open the file " + filename);
            Logger.logError("Couldn't open the file");
            return "";
        }
        try {
            String line;
            while ((line = br.readLine()) != null) {
                content = content + line + '\n';
            }
        } catch (Exception e) {
            e.printStackTrace();
            Logger.log("Couldn't read the file " + filename);
            Logger.logError("Couldn't read the file");
            return "";
        }

        Logger.log("Successfully loaded the file " + filename);
        return content;
    }

    // modifies fileName with content and commits it in the Git Repo
    // returns true if the function is sucessful, false otherwise
    public boolean save_turt_file(String fileName, String content) {
        // we get the file, which can exist or not
        Node root = project.getRootNode();
        Logger.log("The root of the project is " + root.getPath().toString());
        Logger.log("We are trying to save the file " + fileName);
        Path fileResolved = root.getPath().resolve(fileName);
        Logger.log("The file to save is " + fileResolved.toString());
        File file = new File(fileResolved.toString());

        // we check whether the file exists or not
        if (!file.exists()) {
            try {
                // if the file does not already exist, we create it
                file.createNewFile();
            }
            catch (Exception e) {
                e.printStackTrace();
                Logger.log("Couldn't create the new file " + fileName);
                Logger.logError("Couldn't create the new file");
                return false;
            }
        }
        try {
            // we overwrite all the contents of the file named filename by the string content
            Files.writeString(Path.of(file.getPath()), content, StandardCharsets.UTF_8);
        }
        catch (Exception e) {
            e.printStackTrace();
            Logger.log("Couldn't write the contents into " + fileName);
            Logger.logError("Couldn't write the contents into " + fileName);
            return false;
        }

        // once the file is up-to-date, we have to add it with Git
        Feature.ExecutionReport addReport = project.getFeature(Mandatory.Features.Git.ADD).get().execute(project, fileName);
        if (!addReport.isSuccess()) {
            Logger.log("Couldn't add " + fileName);
            Logger.logError("Couldn't add " + fileName);
            return false;
        }

        // now we just need to commit
        Feature.ExecutionReport commitReport = project.getFeature(Mandatory.Features.Git.COMMIT).get().execute(project, "-m", fileName + " was saved at " + LocalTime.now());
        if (!commitReport.isSuccess()) {
            Logger.log("Couldn't commit " + fileName);
            Logger.logError("Couldn't commit " + fileName);
            return false;
        }

        Logger.log("Successfully saved the file " + fileName);
        return true;
    }

    public Project load_project(String path) {
        Path project_path = Path.of(System.getProperty("user.dir")).resolve(path);
        Logger.log("Trying to load " + project_path.toString());
        return project_service.load(project_path);
    }

    public String open_file(String path) throws Exception {
        try {
            Path file_path = Path.of(System.getProperty("user.dir")).resolve(path);
            File file = file_path.toFile();
            if (file.exists()) {
                return new String(Files.readAllBytes(file_path));
            }
            else
                throw new RuntimeException("File not found");
        } catch (Exception e) {
            throw e;
        }
    }

    public Node create_file(String path) {
        return project_service.getNodeService().create(project.getRootNode(), path, Node.Types.FILE);
    }
    public Node create_folder(String path) {
        return project_service.getNodeService().create(project.getRootNode(), path, Node.Types.FOLDER);
    }

    private Node find_node(Node parent, Path target) {
        if (parent.getPath().toString().equals(target.toString())) {
            return parent;
        }
        List<Node> children = parent.getChildren();
        for (var i : children) {
            Node a = find_node(i, target);
            if (a != null) {
                return a;
            }
        }
        return null;
    }
    private Node find_and_remove_node(Node parent, Path target) {
        if (parent.getPath().toString().equals(target.toString())) {
            return parent;
        }
        List<Node> children = parent.getChildren();
        for (var i : children) {
            Node a = find_and_remove_node(i, target);
            if (a != null) {
                parent.getChildren().remove(a);
                return a;
            }
        }
        return null;
    }
    public boolean delete_file(String path) {
        Path file_path = project.getRootNode().getPath().resolve(path);
        Node to_delete = find_and_remove_node(project.getRootNode(), file_path);
        if (to_delete == null)
            return false;
        return project_service.getNodeService().delete(to_delete);
    }

    public boolean delete_folder(String path) {
        Path file_path = project.getRootNode().getPath().resolve(path);
        Node to_delete = find_and_remove_node(project.getRootNode(), file_path);
        if (to_delete == null)
            return false;
        return project_service.getNodeService().delete(to_delete);
    }


    public static <T extends Enum<T>> Optional<T> getEnumFromString(Class<T> enumClass, String value) {
        try {
            return Optional.of(Enum.valueOf(enumClass, value));
        } catch (IllegalArgumentException | NullPointerException e) {
            return Optional.empty();
        }
    }
    public Feature.ExecutionReport execute_feature(String feature, List<String> params, String project) {
        Project proj = load_project(project);
        Optional<Mandatory.Features.Any> any_feature_type = getEnumFromString(Mandatory.Features.Any.class, feature);
        Optional<Mandatory.Features.Git> git_feature_type = getEnumFromString(Mandatory.Features.Git.class, feature);
        Optional<Mandatory.Features.Maven> maven_feature_type = getEnumFromString(Mandatory.Features.Maven.class, feature);
        if (any_feature_type.isPresent()) {
            if (proj.getFeature(any_feature_type.get()).isEmpty())
                return null;
            return project_service.execute(proj, any_feature_type.get(), params);
        }
        else if (git_feature_type.isPresent()) {
            if (proj.getFeature(git_feature_type.get()).isEmpty())
                return null;
            return project_service.execute(proj, git_feature_type.get(), params);
        }
        else if (maven_feature_type.isPresent()) {
            if (proj.getFeature(maven_feature_type.get()).isEmpty())
                return null;
            return project_service.execute(proj, maven_feature_type.get(), params);
        }
        else
            return null;
    }

    public Node move(String target, String destination) {
        Path dest_path = project.getRootNode().getPath().resolve(destination);
        Node dest_node = find_node(project.getRootNode(), dest_path);
        Path target_path = project.getRootNode().getPath().resolve(target);
        Node target_node = find_and_remove_node(project.getRootNode(), target_path);
        return project_service.getNodeService().move(target_node, dest_node);
    }

    public Node update(String path, int from, int to, String content) {
        Path file_path = project.getRootNode().getPath().resolve(path);
        Node to_update = find_node(project.getRootNode(), file_path);
        return project_service.getNodeService().update(to_update, from, to, content.getBytes());
    }
    /**
     * Init method. It must return a fully functional implementation of {@link ProjectService}.
     *
     * @return An implementation of {@link ProjectService}.
     */
    public static ProjectService init(final Configuration configuration) {
        return new MyProjectService(new MyNodeService());
    }
    public static ProjectService init() {
        return new MyProjectService(new MyNodeService());
    }

    /**
     * Record to specify where the configuration of your IDE
     * must be stored. Might be useful for the search feature.
     */
    public record Configuration(Path indexFile,
                                Path tempFolder) {
    }

}
