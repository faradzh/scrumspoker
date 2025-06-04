import { Issue, JiraIssue, JiraIssueResponse } from "../../entities/types";

class JiraIssueTransformer {
  public transform(data: JiraIssueResponse): Issue[] {
    const issues = data.issues;
    return issues.map((issue) => this.transformIssue(issue));
  }

  private transformIssue(issue: JiraIssue): Issue {
    return {
      id: issue.id,
      key: issue.key,
      status: issue.fields.status.name,
      priority: issue.fields.priority.name,
      assignee: issue.fields.assignee,
      reporter: issue.fields.reporter.displayName,
      issuetype: issue.fields.issuetype.name,
      comment: issue.fields.comment,
      customfield_10016: issue.fields.customfield_10016,
      summary: issue.fields.summary,
      description: issue.fields.description,
    };
  }
}

export default JiraIssueTransformer;
