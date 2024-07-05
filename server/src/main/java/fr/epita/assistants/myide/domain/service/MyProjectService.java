package fr.epita.assistants.myide.domain.service;

import fr.epita.assistants.myide.domain.entity.*;
import jakarta.validation.constraints.NotNull;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

public class MyProjectService implements ProjectService{
    private NodeService node_service;

    public MyProjectService(@NotNull NodeService node_service) {
        this.node_service = node_service;
    }
    @Override
    public Project load(Path root) {
        if (!Files.isDirectory(root)) {
            String message = String.format("Invalid project root: %s", root);
            throw new IllegalArgumentException(message);
        }
        MyNode new_node = new MyNode(root, Node.Types.FOLDER);

        Set<Aspect> aspects = new HashSet<>();
        aspects.add(new MyAspect(Mandatory.Aspects.ANY));
        if (Files.exists(root.resolve(".git"))) {
            aspects.add(new MyAspect(Mandatory.Aspects.GIT));
        }
        if (Files.exists(root.resolve("pom.xml"))) {
            aspects.add(new MyAspect(Mandatory.Aspects.MAVEN));
        }

        Set<Feature> features = new HashSet<>();
        for (var i : aspects) {
            features.addAll(i.getFeatureList());
        }
        return new MyProject(new_node, aspects, features);
    }

    @Override
    public Feature.ExecutionReport execute(Project project, Feature.Type featureType, Object... params) {
        Feature f = new MyFeature(featureType);
        return f.execute(project, params);
    }

    @Override
    public NodeService getNodeService() {
        return node_service;
    }
}
