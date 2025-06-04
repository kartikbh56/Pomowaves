import { Databases, Permission, Role, ID, Query } from "appwrite";
import { client } from "./appwrite";
import { getCurrentUser } from "./auth";

const databases = new Databases(client);
let userId;
async function initializeUser() {
  try {
    const { $id } = await getCurrentUser();
    userId = $id;
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
const leaderboardCollectionId = import.meta.env
  .VITE_APPWRITE_LEADERBOARD_COLLECTION_ID;

// Tasks
export async function fetchTasks() {
  const result = await databases.listDocuments(
    databaseId, // databaseId
    tasksCollectionId // collectionIdj
  );
  return result.documents;
}

export async function addTask(task, taskId) {
  let result = await databases.createDocument(
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
  return result;
}

export async function updateTask(documentId, modification) {
  const result = await databases.updateDocument(
    databaseId, // databaseId
    tasksCollectionId, // collectionId
    documentId, // documentId
    modification
  );
  return result;
}

export async function deleteTask(documentId) {
  await databases.deleteDocument(
    databaseId, // databaseId
    tasksCollectionId, // collectionId
    documentId // documentId
  );
}

/*********************************************************************************/
// currentTask

export async function fetchCurrentTask() {
  // in currentTask collection, there should be only one document per user
  const result = await databases.listDocuments(
    databaseId,
    currentTaskCollectionId
  );
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
  console.log("created currentTask", result)
  return result;
}

export async function updateCurrentTask(currentTaskDocumentID, newTaskId) {
  const result = await databases.updateDocument(
    databaseId,
    currentTaskCollectionId,
    currentTaskDocumentID,
    { currentTaskId: newTaskId }
  );
  return result;
}

/*********************************************************************************/
// Timer settings

export async function fetchTimerSettings() {
  const result = await databases.listDocuments(
    databaseId, // databaseId
    timerSettingsCollectionId // collectionId
  );
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
  console.log("created timerSettings", result)
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
  return result
}

/*********************************************************************************/
// Timeline
export async function initialFetchTimeline(limit) {
  const docs = await databases.listDocuments(databaseId, timeLineCollectionId, [
    Query.limit(limit),
    Query.orderDesc("startedAt"),
  ]);
  return docs;
}

export async function fetchTimeline(limit, lastId) {
  const docs = await databases.listDocuments(databaseId, timeLineCollectionId, [
    Query.limit(limit),
    Query.cursorAfter(lastId),
    Query.orderDesc("startedAt"),
  ]);
  return docs;
}

export async function fetchTimelineOnDate(fromDate, toDate) {
  const docs = await databases.listDocuments(databaseId, timeLineCollectionId, [
    Query.and([
      Query.lessThan("endedAt", toDate),
      Query.greaterThan("startedAt", fromDate),
    ]),
    Query.limit(5000),
  ]);
  return docs;
}

export async function addTimeLine(report) {
  let result = await databases.createDocument(
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

  return result;
}

export async function deleteTimeline(documentId) {
  const result = await databases.deleteDocument(
    databaseId, // databaseId
    timeLineCollectionId, // collectionId
    documentId // documentId
  );
  return result
}

/******************************************************************/
// REPORTS
export async function fetchReports() {
  const result = await databases.listDocuments(databaseId, reportsCollectionId);
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
  console.log("created reports",result)
  return result;
}

export async function updateReport(reportsDocumentId, modification) {
  const result = await databases.updateDocument(
    databaseId,
    reportsCollectionId,
    reportsDocumentId,
    modification
  );
  return result;
}

/******************************************************************/
// Leaderboard

export async function fetchleaderboardEntries() {
  const docs = await databases.listDocuments(
    databaseId,
    leaderboardCollectionId,
    [Query.orderDesc("minutesFocused")]
  );
  return docs?.documents;
}

export async function getUserFromLeaderboard(userId) {
  const result = await databases.listDocuments(
    databaseId, // databaseId
    leaderboardCollectionId, // collectionId
    [Query.equal("userId", [userId])]
  );
  return result?.documents;
}

export async function addUserToLeaderboard(userId, name) {
  const result = await databases.createDocument(
    databaseId, // databaseId
    leaderboardCollectionId, // collectionId
    ID.unique(), // documentId
    { userId: userId, name: name, minutesFocused: 0 } // data
  );
  return result;
}

export async function updateLeaderboardProgress(documentId, modification) {
  const result = await databases.updateDocument(
    databaseId, // databaseId
    leaderboardCollectionId, // collectionId
    documentId, // documentId
    modification
  );
  return result
}
