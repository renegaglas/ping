package fr.epita.assistants.myide.domain.entity;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class MyNode implements Node{
    public MyNode(Path path, Type type) {
        this.path = path;
        this.type = type;
        List<@NotNull Node> children = new ArrayList<>();
        if (type == Types.FOLDER) {
            File node_file = path.toFile();
            File[] files = node_file.listFiles();
            if (files != null) {
                for (File i : files) {
                    Node elem = new MyNode(path.resolve(i.getName()), i.isDirectory() ? Types.FOLDER : Types.FILE);
                    children.add(elem);
                }
            }
        }
        this.children = children;
    }
    private Path path;
    private Type type;
    private List<@NotNull Node> children;

    @Override
    public Path getPath() {
        return path;
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    public List<@NotNull Node> getChildren() {
        return children;
    }
}
