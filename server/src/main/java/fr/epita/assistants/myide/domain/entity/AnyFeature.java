package fr.epita.assistants.myide.domain.entity;

import fr.epita.assistants.myide.utils.MyUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.*;

public class AnyFeature {
    public static MyFeature.MyExecutionReport handleAny(MyFeature feature, Project project, String options) {
        if (feature.type() == Mandatory.Features.Any.DIST)
            return dist(feature, project, options);
        if (feature.type() == Mandatory.Features.Any.CLEANUP)
            return cleanup(feature, project, options);
        if (feature.type() == Mandatory.Features.Any.SEARCH)
            return search(feature, project, options);
        System.err.println(String.format("Unsupported feature %s.", feature.type().toString()));
        return feature.new MyExecutionReport(false);
    }

    private static MyFeature.MyExecutionReport cleanup(MyFeature feature, Project project, String options) {
        Path project_root = project.getRootNode().getPath();
        Path ignoreFilePath = project_root.resolve(".myideignore");
        try {
            List<String> lines = Files.readAllLines(ignoreFilePath);
            for (String line : lines) {
                Path filePath = project_root.resolve(line);

                if (Files.exists(filePath)) {
                    MyUtils.delete_file(line, project);
                    System.out.println("Deleted: " + filePath);
                } else {
                    System.out.println("File does not exist: " + filePath);
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading .myideignore: " + e.getMessage());
            return feature.new MyExecutionReport(false);
        }
        return feature.new MyExecutionReport(true);
    }


    private static boolean zip_file(ZipOutputStream res, Path file, Path dist_path) {
        ZipEntry ze = new ZipEntry(dist_path.relativize(file).toString());
        try {
            res.putNextEntry(ze);
            res.write(Files.readAllBytes(file));
            res.closeEntry();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return true;
    }

    private static boolean zip_dir(ZipOutputStream res, Path dist_path, String archive) {
        try {
            Files.walk(dist_path)
                    .filter(file -> !Files.isDirectory(file))
                    .filter(file -> file.toAbsolutePath().toString().contains(archive.substring(0, archive.length() - 4)))
                    .filter(file -> !file.toAbsolutePath().toString().contains(".zip"))
                    /*
                    .filter(x -> {
                        try {
                            return !Files.isHidden(x);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    */
                    .forEach(file -> {
                        System.out.println(file);
                        zip_file(res, file, dist_path);
                    });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return true;
    }
    private static MyFeature.MyExecutionReport dist(MyFeature feature, Project project, String options) {
        MyFeature.MyExecutionReport cl = cleanup(feature, project, options);
        if (!cl.isSuccess())
            return cl;
        Path dist_path = project.getRootNode().getPath();
        //Path parent_path = Path.of(System.getProperty("user.dir"));
        Path parent_path = dist_path.getParent();
        String archive = dist_path.getFileName().toString() + ".zip";

        try (ZipOutputStream res = new ZipOutputStream(Files.newOutputStream(parent_path.resolve(archive)))) {
            zip_dir(res, dist_path.getParent(), archive);
        } catch (IOException e) {
            e.printStackTrace();
            return feature.new MyExecutionReport(false);
        }
        return feature.new MyExecutionReport(true);
    }

    private static MyFeature.MyExecutionReport search(MyFeature feature, Project project, String options) {
        return null;
    }

    private static boolean searchFolder(List<Node> children, String options) throws IOException {
        return false;
    }
}
