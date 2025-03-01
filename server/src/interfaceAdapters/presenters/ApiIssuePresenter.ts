import { TIssue } from "../../entities/Issue";

class ApiIssuePresenter {
    public presentIssue(issue: TIssue): TIssue {
        return {
            ...issue
        };
    }
}

export default ApiIssuePresenter;