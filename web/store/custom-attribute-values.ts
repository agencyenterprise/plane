// mobx
import { action, observable, runInAction, makeAutoObservable } from "mobx";
// services
import customAttributesService from "services/custom-attributes.service";
// types
import type { ICustomAttributeValue, ICustomAttributeValueFormData } from "types";

class CustomAttributeValuesStore {
  issueAttributeValues: {
    [key: string]: ICustomAttributeValue[];
  } | null = null;
  // loaders
  fetchIssueAttributeValuesLoader = false;
  // errors
  error: any | null = null;
  rootStore: any | null = null;

  constructor(_rootStore: any | null = null) {
    makeAutoObservable(this, {
      issueAttributeValues: observable.ref,
      fetchIssueAttributeValues: action,
      createAttributeValue: action,
    });

    this.rootStore = _rootStore;
  }

  fetchIssueAttributeValues = async (workspaceSlug: string, projectId: string, issueId: string) => {
    try {
      runInAction(() => {
        this.fetchIssueAttributeValuesLoader = true;
      });

      const response = await customAttributesService.getAttributeValues(
        workspaceSlug,
        projectId,
        issueId
      );

      runInAction(() => {
        this.issueAttributeValues = {
          ...this.issueAttributeValues,
          [issueId]: response.children,
        };
        this.fetchIssueAttributeValuesLoader = false;
      });
    } catch (error) {
      runInAction(() => {
        this.fetchIssueAttributeValuesLoader = false;
        this.error = error;
      });
    }
  };

  createAttributeValue = async (
    workspaceSlug: string,
    projectId: string,
    issueId: string,
    data: ICustomAttributeValueFormData
  ) => {
    const newChildren = [...(this.issueAttributeValues?.[issueId] ?? [])];
    const attributesToUpdate = [...Object.keys(data.issue_properties)];

    newChildren.map((child) => {
      if (attributesToUpdate.includes(child.id) && child)
        child.prop_value = [{ type: "", value: data.issue_properties[child.id] }];

      return child;
    });

    try {
      runInAction(() => {
        this.issueAttributeValues = {
          ...this.issueAttributeValues,
          [issueId]: [...newChildren],
        };
      });

      const date = new Date();
      const unixEpochTimeInSeconds = Math.floor(date.getTime() / 1000);

      const response = await customAttributesService.createPropertyValues(
        workspaceSlug,
        projectId,
        issueId,
        { ...data, a_epoch: unixEpochTimeInSeconds }
      );

      runInAction(() => {
        this.issueAttributeValues = {
          ...this.issueAttributeValues,
          [issueId]: response.children,
        };
        this.fetchIssueAttributeValuesLoader = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error;
      });
    }
  };
}

export default CustomAttributeValuesStore;