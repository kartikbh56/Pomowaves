import { Databases, Permission, Role, ID } from "appwrite";
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

export async function fetchTasks() {
  const result = await databases.listDocuments(
    databaseId, // databaseId
    tasksCollectionId // collectionIdj
  );
  console.log("Fetched tasks");
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

// export async function deleteCurrentTask(currentTaskId) {
//   const result = await databases.deleteDocument(
//     databaseId,
//     currentTaskCollectionId,
//     currentTaskId
//   );
//   console.log(result);
// }

export async function updateCurrentTask(currentTaskDocumentID, newTaskId) {
  const result = await databases.updateDocument(
    databaseId,
    currentTaskCollectionId,
    currentTaskDocumentID,
    { currentTaskId: newTaskId }
  );
  console.log("updated currentTask", result);
}
