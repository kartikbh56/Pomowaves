import { Databases, Permission, Role } from "appwrite";
import { client } from "./appwrite";


const databases = new Databases(client);

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID
const tasksCollectionId = import.meta.env.VITE_APPWRITE_TASKS_COLLECTION_ID

export async function fetchTasks(){
    const result = await databases.listDocuments(
        databaseId, // databaseId
        tasksCollectionId, // collectionId
    );    
    console.log(result);
}

export function addTask(task, userId) {
  let promise = databases.createDocument(
    databaseId,
    tasksCollectionId,
    task,
    [
      Permission.read(Role.user(userId)), // Only this user can read
      Permission.update(Role.user(userId)), // Only this user can update
      Permission.delete(Role.user(userId)), // Only this user can delete
    ]
  );

  promise.then(
    function (response) {
      console.log(response);
    },
    function (error) {
      console.log(error);
    }
  );
}