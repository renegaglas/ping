package fr.epita.assistants.myide.domain.entity;

import java.util.ArrayList;
import java.util.List;

public class MyAspect implements Aspect{
    private Type type;
    private List<Feature> features;
    public MyAspect(Type type) {
        this.type = type;
        List<Feature> list = new ArrayList<>();
        if (type == Mandatory.Aspects.ANY) {
            list.add(new MyFeature(Mandatory.Features.Any.DIST));
            list.add(new MyFeature(Mandatory.Features.Any.CLEANUP));
            list.add(new MyFeature(Mandatory.Features.Any.SEARCH));
        }
        else if (type == Mandatory.Aspects.GIT) {
            list.add(new MyFeature(Mandatory.Features.Git.ADD));
            list.add(new MyFeature(Mandatory.Features.Git.COMMIT));
            list.add(new MyFeature(Mandatory.Features.Git.PUSH));
            list.add(new MyFeature(Mandatory.Features.Git.PULL));
            list.add(new MyFeature(GitFeature.OurGit.CHECKOUT));
        }
        else {
            list.add(new MyFeature(Mandatory.Features.Maven.CLEAN));
            list.add(new MyFeature(Mandatory.Features.Maven.EXEC));
            list.add(new MyFeature(Mandatory.Features.Maven.COMPILE));
            list.add(new MyFeature(Mandatory.Features.Maven.TEST));
            list.add(new MyFeature(Mandatory.Features.Maven.INSTALL));
            list.add(new MyFeature(Mandatory.Features.Maven.TREE));
            list.add(new MyFeature(Mandatory.Features.Maven.PACKAGE));
        }
        features = list;
    }

    @Override
    public Type getType() {
        return type;
    }

    @Override
    public List<Feature> getFeatureList() {
        return features;
    }
}
