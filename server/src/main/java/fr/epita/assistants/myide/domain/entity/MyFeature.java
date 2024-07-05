package fr.epita.assistants.myide.domain.entity;

public class MyFeature implements Feature{
    private Type type;
    public  MyFeature(Type type) {
        this.type = type;
    }
    @Override
    public ExecutionReport execute(Project project, Object... params) {
        String options = "";
        if (params != null) {
            for (Object object : params) {
                options += " " + object.toString();
            }
        }

        if (type instanceof Mandatory.Features.Any) {
            return AnyFeature.handleAny(this, project, options);

        } else if (type instanceof Mandatory.Features.Git || type instanceof GitFeature.OurGit) {
            return GitFeature.handleGit(this, project, params);

        } else if (type instanceof Mandatory.Features.Maven) {
            return MaevenFeature.handleMaven(this, project, options);

        } else {
            throw new NullPointerException("Unsupported feature.");
        }
    }

    @Override
    public Type type() {
        return type;
    }

    public class MyExecutionReport implements Feature.ExecutionReport {
        private boolean success;

        public MyExecutionReport(boolean success) {
            this.success = success;
        }

        @Override
        public boolean isSuccess() {
            return success;
        }

    }
}
