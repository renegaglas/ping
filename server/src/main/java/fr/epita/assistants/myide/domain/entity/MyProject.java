package fr.epita.assistants.myide.domain.entity;

import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.lib.RepositoryBuilder;

import java.util.Iterator;
import java.util.Optional;
import java.util.Set;

public class MyProject implements Project{
    public MyProject(Node root, Set<Aspect> aspects, Set<Feature> features) {
        this.root = root;
        this.aspects = aspects;
        this.features = features;

        // does the root already have a Git repo?
        try {
            this.git = Git.open(root.getPath().toFile());
        }
        catch (Exception e) {
            // the repo doesn't exist, let's create one
            try {
                this.git = Git.init().setDirectory(root.getPath().toFile()).call();
            }
            catch (Exception e_init) {
                e_init.printStackTrace();
            }
        }
    }
    private Node root;
    private Set<Aspect> aspects;
    private Set<Feature> features;
    private Git git;
    @Override
    public Node getRootNode() {
        return root;
    }

    @Override
    public Set<Aspect> getAspects() {
        return aspects;
    }

    @Override
    public Optional<Feature> getFeature(Feature.Type featureType) {
        Iterator<Feature> i = features.iterator();
        while (i.hasNext()) {
            Feature ft = i.next();
            if (ft.type() == featureType) {
                return Optional.ofNullable(ft);
            }
        }
        return Optional.empty();
    }

    public Git getGit() {
        return this.git;
    }
}
