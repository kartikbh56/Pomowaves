import { Databases, Permission, Role, ID, Query } from "appwrite";
import { client } from "./appwrite";
import { getCurrentUser } from "./auth";

const databases = new Databases(client);
let userId;
async function initializeUser() {
  try {
    const { $id } = await getCurrentUser();
    userId = $id;
    console.log(userId);
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
}

initializeUser();

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const tasksCollectionId = import.meta.env.VITE_APPWRITE_TASKS_COLLECTION_ID;
const currentTaskCollectionId = import.meta.env
  .VITE_APPWRITE_CURRENT_TASK_COLLECTION_ID;
const timerSettingsCollectionId = import.meta.env
  .VITE_APPWRITE_TIMER_SETTINGS_COLLECTION_ID;
const timeLineCollectionId = import.meta.env
  .VITE_APPWRITE_TIMELINE_COLLECTION_ID;
const reportsCollectionId = import.meta.env.VITE_APPWRITE_REPORTS_COLLECTION_ID;

// Tasks
export async function fetchTasks() {
  const result = await databases.listDocuments(
    databaseId, // databaseId
    tasksCollectionId // collectionIdj
  );
  console.log("Fetched tasks");
  console.log(result.documents);
  return result.documents;
}

export function addTask(task, taskId) {
  let promise = databases.createDocument(
    databaseId,
    tasksCollectionId,
    taskId,
    task,
    [
      Permission.read(Role.user(userId)), // Only this user can read
      Permission.update(Role.user(userId)), // Only this user can update
      Permission.delete(Role.user(userId)), // Only this user can delete
    ]
  );

  promise.then(
    function (response) {
      console.log("Task added: ", response);
    },
    function (error) {
      console.log(error);
    }
  );
}

export async function updateTask(documentId, modification) {
  const result = await databases.updateDocument(
    databaseId, // databaseId
    tasksCollectionId, // collectionId
    documentId, // documentId
    modification
  );

  console.log("Task updated", result);
}

export async function deleteTask(documentId) {
  const result = await databases.deleteDocument(
    databaseId, // databaseId
    tasksCollectionId, // collectionId
    documentId // documentId
  );
  console.log("Task deleted", result);
}

/*********************************************************************************/
// currentTask

export async function fetchCurrentTask() {
  // in currentTask collection, there should be only one document per user
  const result = await databases.listDocuments(
    databaseId,
    currentTaskCollectionId
  );
  console.log("Fetched currentTask ", result?.documents);
  return result?.documents[0];
}

export async function addCurrentTask(currentTaskId) {
  const result = await databases.createDocument(
    databaseId, // databaseId
    currentTaskCollectionId, // collectionId
    ID.unique(), // documentId
    { currentTaskId: currentTaskId }, // data
    [
      Permission.read(Role.user(userId)), // Only this user can read
      Permission.update(Role.user(userId)), // Only this user can update
      Permission.delete(Role.user(userId)), // Only this user can delete
    ]
  );
  console.log("Added currentTask");
  return result;
}

export async function updateCurrentTask(currentTaskDocumentID, newTaskId) {
  const result = await databases.updateDocument(
    databaseId,
    currentTaskCollectionId,
    currentTaskDocumentID,
    { currentTaskId: newTaskId }
  );
  console.log("updated currentTask", result);
}

/*********************************************************************************/
// Timer settings

export async function fetchTimerSettings() {
  const result = await databases.listDocuments(
    databaseId, // databaseId
    timerSettingsCollectionId // collectionId
  );
  console.log("Fetched timer settings");
  console.log("timerSettings", result);
  return result?.documents[0];
}

export async function createTimerSettings(timerSettings) {
  const result = await databases.createDocument(
    databaseId, // databaseId
    timerSettingsCollectionId, // collectionId
    ID.unique(), // documentId
    timerSettings, // data
    [
      Permission.read(Role.user(userId)), // Only this user can read
      Permission.update(Role.user(userId)), // Only this user can update
      Permission.delete(Role.user(userId)), // Only this user can delete
    ]
  );
  console.log("Added Timer Settings", result);
  return result;
}

export async function updateTimerSettings(
  timerSettingsDocumentId,
  modification
) {
  const result = await databases.updateDocument(
    databaseId,
    timerSettingsCollectionId,
    timerSettingsDocumentId,
    modification
  );
  console.log("updated timer settings", result);
}

/*********************************************************************************/
// Timeline
export async function initialFetchTimeline(limit) {
  const docs = await databases.listDocuments(databaseId, timeLineCollectionId, [
    Query.limit(limit),
    Query.orderDesc("startedAt"),
  ]);
  console.log("timeline", docs);
  return docs;
}

export async function fetchTimeline(limit, lastId) {
  const docs = await databases.listDocuments(databaseId, timeLineCollectionId, [
    Query.limit(limit),
    Query.cursorAfter(lastId),
    Query.orderDesc("startedAt"),
  ]);
  console.log("timeline", docs);
  return docs;
}

export async function fetchTimelineOnDate(fromDate, toDate) {
  const docs = await databases.listDocuments(databaseId, timeLineCollectionId, [
    Query.and([
      Query.lessThan("$createdAt", toDate),
      Query.greaterThan("$createdAt", fromDate),
    ]),
    Query.limit(5000),
  ]);
  console.log("timeline from ", fromDate,toDate, docs);
  return docs;
}

export async function addTimeLine(report) {
  let promise = databases.createDocument(
    databaseId,
    timeLineCollectionId,
    report.id,
    {
      task: report.task,
      startedAt: report.startedAt,
      endedAt: report.endedAt,
    },
    [
      Permission.read(Role.user(userId)), // Only this user can read
      Permission.update(Role.user(userId)), // Only this user can update
      Permission.delete(Role.user(userId)), // Only this user can delete
    ]
  );

  promise.then(
    function (response) {
      console.log("Timeline added: ", response);
    },
    function (error) {
      console.log(error);
    }
  );
}

export async function deleteTimeline(documentId) {
  const result = await databases.deleteDocument(
    databaseId, // databaseId
    timeLineCollectionId, // collectionId
    documentId // documentId
  );
  console.log("Task deleted", result);
}

/******************************************************************/
// REPORTS
export async function fetchReports() {
  const result = await databases.listDocuments(databaseId, reportsCollectionId);
  console.log("Fetched reports", result);
  return result?.documents[0];
}

export async function createReport(reports) {
  const result = await databases.createDocument(
    databaseId, // databaseId
    reportsCollectionId, // collectionId
    ID.unique(), // documentId
    reports, // data
    [
      Permission.read(Role.user(userId)), // Only this user can read
      Permission.update(Role.user(userId)), // Only this user can update
      Permission.delete(Role.user(userId)), // Only this user can delete
    ]
  );
  console.log("Added initial reports", result);
  return result;
}

export async function updateReport(reportsDocumentId, modification) {
  const result = await databases.updateDocument(
    databaseId,
    reportsCollectionId,
    reportsDocumentId,
    modification
  );
  // console.log("updated reports settings", result);
  return result;
}
