import type { IUserLite } from "./users";

export interface IUserNotification {
  id: string;
  created_at: Date;
  updated_at: Date;
  data: Data;
  entity_identifier: string;
  entity_name: string;
  title: string;
  message: null;
  message_html: string;
  message_stripped: null;
  sender: string;
  read_at: Date | null;
  archived_at: Date | null;
  snoozed_till: Date | null;
  created_by: null;
  updated_by: null;
  workspace: string;
  project: string;
  triggered_by: string;
  triggered_by_details: IUserLite;
  receiver: string;
}

export interface Data {
  issue: IIssueLite;
  issue_activity: {
    actor: string;
    field: string;
    id: string;
    issue_comment: string | null;
    new_value: string;
    old_value: string;
    verb: "created" | "updated";
  };
}

export interface IIssueLite {
  id: string;
  name: string;
  identifier: string;
  state_name: string;
  sequence_id: number;
  state_group: string;
}

export type NotificationType = "created" | "assigned" | "watching" | null;

export interface INotificationParams {
  snoozed?: boolean;
  type?: NotificationType;
  archived?: boolean;
  read?: boolean;
}