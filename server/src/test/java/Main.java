import fr.epita.assistants.myide.domain.entity.*;
import fr.epita.assistants.myide.domain.service.MyNodeService;
import fr.epita.assistants.myide.domain.service.MyProjectService;
import fr.epita.assistants.myide.domain.service.NodeService;
import fr.epita.assistants.myide.domain.service.ProjectService;

import java.nio.file.Path;

public class Main {
    public static void main(String[] args) {
        NodeService ns = new MyNodeService();
        ProjectService ps = new MyProjectService(ns);
        Project project = ps.load(Path.of("/home/francisco.lara-rico/afs/ping/test_ping_backend"));
        //var report1 = project.getFeature(Mandatory.Features.Git.ADD).get().execute(project, "my_file.txt");
        //System.out.println(report1);
        //var report2 = project.getFeature(Mandatory.Features.Git.COMMIT).get().execute(project, "-m", "feat: new text file (viva)");
        //System.out.println(report2);
        //var report3 = project.getFeature(Mandatory.Features.Git.PUSH).get().execute(project);
        //System.out.println(report3);
        //var report3 = project.getFeature(Mandatory.Features.Git.PULL).get().execute(project);
        //System.out.println(report3);
        //Feature.ExecutionReport a = project.getFeature(Mandatory.Features.Any.CLEANUP).get().execute(project);
        //System.out.println(a);
        //project.getFeature(Mandatory.Features.Any.DIST).get().execute(project);
    }
}
