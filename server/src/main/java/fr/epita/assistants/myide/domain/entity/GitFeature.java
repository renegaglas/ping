package fr.epita.assistants.myide.domain.entity;

import org.eclipse.jgit.api.*;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.errors.NoWorkTreeException;
import org.eclipse.jgit.internal.storage.file.FileRepository;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.transport.PushResult;
import org.eclipse.jgit.transport.RemoteRefUpdate;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.lang.Exception;

import fr.epita.assistants.myide.domain.entity.Mandatory.Features.Git.*;
import org.jctools.util.PortableJvmInfo;

public class GitFeature {
    public enum OurGit implements Feature.Type {
        // Restores a file to its version from the last commit
        CHECKOUT,
    }
    public static MyFeature.MyExecutionReport handleGit(MyFeature feature, Project project, Object... params) {
        List<String> optionList = new ArrayList<String>();
        if (params != null) {
            for (Object param : params) {
                optionList.add(param.toString());
            }
        }
        boolean returnedSuccess = false;
        if (feature.type() ==  Mandatory.Features.Git.ADD) {
            returnedSuccess = runGitAdd(project, optionList);
        }
        if (feature.type() ==  Mandatory.Features.Git.PUSH) {
            returnedSuccess = runGitPush(project, optionList);
        }
        if (feature.type() ==  Mandatory.Features.Git.PULL) {
            returnedSuccess = runGitPull(project, optionList);
        }
        if (feature.type() ==  Mandatory.Features.Git.COMMIT) {
            returnedSuccess = runGitCommit(project, optionList);
        }
        if (feature.type() == OurGit.CHECKOUT) {
            returnedSuccess = runGitCheckout(project, optionList);
        }
        return feature. new MyExecutionReport(returnedSuccess);
    }

    private static MyFeature.MyExecutionReport runGitCommand(MyFeature feature, Path executionPath, String options) {
        return null;
    }

    private static boolean runGitAdd(Project project, List<String> options) {
        // we save the add command to be able to add several files at the same time
        AddCommand addCommand = ((MyProject) project).getGit().add();

        for (String fileName : options) {
            if (fileName == "") {
                continue;
            }
            System.out.println("new filename for add: " + fileName);
            addCommand = addCommand.addFilepattern(fileName);
        }

        // we do the call for our addCommand (we execute the add)
        try {
            addCommand.call();
        }
        catch (Exception e_call) {
            e_call.printStackTrace();
            return false;
        }

        return true;
    }

    private static boolean runGitCommit(Project project, List<String> options) {
        CommitCommand commitCommand = ((MyProject) project).getGit().commit();

        // to handle commit options, we'll have a String containing the empty string if the last option was not a
        // commit option or the commit option otherwise
        // for example: runGitCommit(project, "-m 'salut ca va"):
        // commitOption will be "" when handling "-m" and will become "m" when handling "salut ca va"
        String commitOption = "";

        for (String option : options) {
            System.out.println("new option for commit: " + option);
            if (option == "") {
                continue;
            }
            // we handle commit options first
            if (commitOption == "m") {
                commitCommand = commitCommand.setMessage(option);
                System.out.println("commit message set: " + option);
                commitOption = "";
                continue;
            }

            // is this a commit option?
            if (option == "-m") {
                commitOption = "m";
                continue;
            }
        }

        try {
            commitCommand.call();
        }
        catch (Exception e_commit) {
            e_commit.printStackTrace();
            return false;
        }

        return true;
    }

    private static boolean runGitPush(Project project, List<String> options) {
        PushCommand pushCommand = ((MyProject) project).getGit().push();

        for (String option : options) {
            if (option == "") {
                continue;
            }
            // handle options
        }

        try {
            Iterable<PushResult> iter_push_result = pushCommand.call();
            // if remote was already up-to-date, we return false
            if (iter_push_result.iterator().next()
                    .getRemoteUpdates().iterator().next()
                    .getStatus() == RemoteRefUpdate.Status.UP_TO_DATE) {
                return false;
            }
        }
        catch (Exception e_push) {
            e_push.printStackTrace();
            return false;
        }

        return true;
    }

    private static boolean runGitPull(Project project, List<String> options) {
        PullCommand pullCommand = ((MyProject) project).getGit().pull();

        for (String option : options) {
            if (option == "") {
                continue;
            }
            // handle options
        }

        try {
            pullCommand.call();
        }
        catch (Exception e_pull) {
            e_pull.printStackTrace();
            return false;
        }

        return true;
    }

    private static boolean runGitCheckout(Project project, List<String> options) {
        CheckoutCommand checkoutCommand = ((MyProject) project).getGit().checkout();

        // we suppose all options are files to be restored to their versions of the last commit
        for (String option : options) {
            if (option == "") {
                continue;
            }
            // handle options
            checkoutCommand = checkoutCommand.addPath(option);
        }

        try {
            checkoutCommand.call();
        }
        catch (Exception e_check) {
            e_check.printStackTrace();
            return false;
        }

        return true;
    }
}
