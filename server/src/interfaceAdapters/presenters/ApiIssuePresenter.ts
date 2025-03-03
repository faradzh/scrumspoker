import { Issue } from "../../entities/types";

class ApiIssuePresenter {
    public presentIssue(issue: Issue): Issue {
        return {
            ...issue
        };
    }
}

export default ApiIssuePresenter;