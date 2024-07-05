package fr.epita.assistants.myide.domain.service;

import fr.epita.assistants.myide.domain.entity.MyNode;
import fr.epita.assistants.myide.domain.entity.Node;

import javax.validation.constraints.NotNull;
import java.awt.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;


public class MyNodeService implements NodeService{
    @Override
    public Node update(Node node, int from, int to, byte[] insertedContent) {
        if (node == null || node.isFolder() || to < from)
            throw new IllegalArgumentException("Only non null files can be updated with a valid interval");
        try {
            Path cwp = Path.of(System.getProperty("user.dir"));
            Path node_path = cwp.resolve(node.getPath());
            String to_insert = new String(insertedContent);
            String node_name = new String(Files.readAllBytes(node_path));
            StringBuilder new_name_builder = new StringBuilder(node_name);
            String new_name = new_name_builder.replace(from, to, to_insert).toString();
            Files.write(node_path, new_name.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return node;

    }

    @Override
    public boolean delete(Node node) {
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
            children.forEach(this::delete);
            Path cwp = Path.of(System.getProperty("user.dir"));
            Path node_path = cwp.resolve(node.getPath());
            Files.delete(node_path);
        } catch (IOException e) {
            return false;
        }
        return true;
    }

    @Override
    public Node create(Node folder, String name, Node.Type type) {
        if (name == null || type == null || name.isEmpty()) {
            throw new IllegalArgumentException("Null arguments or empty name.");
        }
        if (folder.isFile()) {
            throw new IllegalArgumentException("Files can't be parent nodes.");
        }
        Path new_path = folder.getPath().resolve(name);
        folder.getChildren().add(new MyNode(new_path, type));
        File new_file = new_path.toFile();
        if (type == Node.Types.FOLDER) {
            if (!new_file.mkdir())
                throw new RuntimeException("Folder Creation failed.");
        }
        else {
            try {
                if (!new_file.createNewFile()) {
                    String error_message = String.format("File creation failed: root: %s file: ", folder.getPath().toString(), name);
                    throw new RuntimeException(error_message);
                }
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException(e);
            }
        }
        return new MyNode(new_file.toPath(), type);
    }

    @Override
    public Node move(Node nodeToMove, Node destinationFolder) {
        if (nodeToMove == null || destinationFolder == null) {
            throw new IllegalArgumentException("Null argument.");
        }
        Path cwp = Path.of(System.getProperty("user.dir"));
        Path nwp = destinationFolder.getPath().resolve(nodeToMove.getPath().getFileName());
        Path absolute_path = cwp.resolve(nwp);
        try {
            Files.move(nodeToMove.getPath(), absolute_path);
            destinationFolder.getChildren().add(nodeToMove);
            return new MyNode(nwp, nodeToMove.getType());
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("File moving failed.", e);
        }
    }
}
