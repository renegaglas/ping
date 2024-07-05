package fr.epita.assistants.myide.utils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import fr.epita.assistants.myide.domain.entity.MyFeature;
import fr.epita.assistants.myide.domain.entity.Node;
import fr.epita.assistants.myide.domain.entity.Project;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.NonNull;

import javax.validation.constraints.NotNull;

public class MyUtils {
    private static Node find_node(Node parent, Path target) {
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
    private static Node find_and_remove_node(Node parent, Path target) {
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
    public static boolean delete_file(String path, Project project) {
        Path file_path = project.getRootNode().getPath().resolve(path);
        Node to_delete = find_and_remove_node(project.getRootNode(), file_path);
        if (to_delete == null)
            return false;
        return delete(to_delete);
    }

    public static boolean delete(Node node) {
        if (node.isFile()) {
            try {
                Path cwp = Path.of(System.getProperty("user.dir"));
                Path node_path = cwp.resolve(node.getPath());
                Files.delete(node_path);
            } catch (IOException e) {
                return false;
            }
            return true;
        }
        try {
            List<@NotNull Node> children = node.getChildren();
            children.forEach(MyUtils::delete);
            Path cwp = Path.of(System.getProperty("user.dir"));
            Path node_path = cwp.resolve(node.getPath());
            Files.delete(node_path);
        } catch (IOException e) {
            return false;
        }
        return true;
    }
}


