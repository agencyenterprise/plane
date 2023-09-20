import { orderArrayBy } from "helpers/array.helper";
import { renderDateFormat } from "helpers/date-time.helper";
// types
import { IIssue, TIssueGroupByOptions, TIssueOrderByOptions } from "types";

type THandleIssuesMutation = (
  formData: Partial<IIssue>,
  oldGroupTitle: string,
  selectedGroupBy: TIssueGroupByOptions,
  issueIndex: number,
  orderBy: TIssueOrderByOptions,
  prevData?:
    | {
        [key: string]: IIssue[];
      }
    | IIssue[]
) =>
  | {
      [key: string]: IIssue[];
    }
  | IIssue[]
  | undefined;

export const handleIssuesMutation: THandleIssuesMutation = (
  formData,
  oldGroupTitle,
  selectedGroupBy,
  issueIndex,
  orderBy,
  prevData
) => {
  if (!prevData) return prevData;

  if (Array.isArray(prevData)) {
    const updatedIssue = {
      ...prevData[issueIndex],
      ...formData,
      assignees: formData?.assignees_list ?? prevData[issueIndex]?.assignees,
      labels: formData?.labels_list ?? prevData[issueIndex]?.labels,
    };

    prevData.splice(issueIndex, 1, updatedIssue);

    return [...prevData];
  } else {
    const oldGroup = prevData[oldGroupTitle ?? ""] ?? [];

    let newGroup: IIssue[] = [];

    if (selectedGroupBy === "priority") newGroup = prevData[formData.priority ?? ""] ?? [];
    else if (selectedGroupBy === "state") newGroup = prevData[formData.state ?? ""] ?? [];

    const updatedIssue = {
      ...oldGroup[issueIndex],
      ...formData,
      assignees: formData?.assignees_list ?? oldGroup[issueIndex]?.assignees,
      labels: formData?.labels_list ?? oldGroup[issueIndex]?.labels,
    };

    if (selectedGroupBy !== Object.keys(formData)[0])
      return {
        ...prevData,
        [oldGroupTitle ?? ""]: orderArrayBy(
          oldGroup.map((i) => (i.id === updatedIssue.id ? updatedIssue : i)),
          orderBy
        ),
      };

    const groupThatIsUpdated = selectedGroupBy === "priority" ? formData.priority : formData.state;

    return {
      ...prevData,
      [oldGroupTitle ?? ""]: orderArrayBy(
        oldGroup.filter((i) => i.id !== updatedIssue.id),
        orderBy
      ),
      [groupThatIsUpdated ?? ""]: orderArrayBy([...newGroup, updatedIssue], orderBy),
    };
  }
};

export type TIssueLayouts = "list" | "kanban" | "calendar" | "spreadsheet" | "gantt_chart";
export type TIssueParams =
  | "priority"
  | "state_group"
  | "state"
  | "assignees"
  | "created_by"
  | "labels"
  | "start_date"
  | "target_date"
  | "group_by"
  | "order_by"
  | "type"
  | "sub_issue"
  | "show_empty_groups"
  | "calendar_date_range"
  | "start_target_date";

export const handleIssueQueryParamsByLayout = (_layout: TIssueLayouts | undefined): TIssueParams[] | null => {
  if (_layout === "list")
    return [
      "priority",
      "state_group",
      "state",
      "assignees",
      "created_by",
      "labels",
      "start_date",
      "target_date",
      "group_by",
      "order_by",
      "type",
      "sub_issue",
      "show_empty_groups",
    ];
  if (_layout === "kanban")
    return [
      "priority",
      "state_group",
      "state",
      "assignees",
      "created_by",
      "labels",
      "start_date",
      "target_date",
      "group_by",
      "order_by",
      "type",
      "sub_issue",
      "show_empty_groups",
    ];
  if (_layout === "calendar")
    return [
      "priority",
      "state_group",
      "state",
      "assignees",
      "created_by",
      "labels",
      "start_date",
      "target_date",
      "type",
      "calendar_date_range",
    ];
  if (_layout === "spreadsheet")
    return [
      "priority",
      "state_group",
      "state",
      "assignees",
      "created_by",
      "labels",
      "start_date",
      "target_date",
      "type",
      "sub_issue",
    ];
  if (_layout === "gantt_chart")
    return [
      "priority",
      "state",
      "assignees",
      "created_by",
      "labels",
      "start_date",
      "target_date",
      "order_by",
      "type",
      "sub_issue",
      "start_target_date",
    ];

  return null;
};

export const handleIssueParamsDateFormat = (key: string, start_date: any | null, target_date: any | null) => {
  if (key === "last_week")
    return `${renderDateFormat(new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000))};after,${renderDateFormat(
      new Date()
    )};before`;

  if (key === "2_weeks_from_now")
    return `${renderDateFormat(new Date())};after,
      ${renderDateFormat(new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000))};before`;

  if (key === "1_month_from_now")
    return `${renderDateFormat(new Date())};after,${renderDateFormat(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
    )};before`;

  if (key === "2_months_from_now")
    return `${renderDateFormat(new Date())};after,${renderDateFormat(
      new Date(new Date().getFullYear(), new Date().getMonth() + 2, new Date().getDate())
    )};before`;

  if (key === "custom" && start_date && target_date)
    return `${renderDateFormat(start_date)};after,${renderDateFormat(target_date)};before`;
};