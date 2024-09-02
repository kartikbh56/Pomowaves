/* eslint-disable react/prop-types */
import { useState } from "react";
import Progress from "./Progress";
import { v4 as uuidv4 } from 'uuid';

export default function Tasks({
  tasks,
  currentTask,
  completedPomodoros,
  mode,
  dispatch,
}) {
  return (
    <>
      <CurrentTask
        currentTask={tasks.find((e) => e.id === currentTask)?.task}
        completedPomodoros={completedPomodoros}
        mode={mode}
      />
      <TaskList tasks={tasks} currentTask={currentTask} dispatch={dispatch} />
      <AddTask dispatch={dispatch} />
    </>
  );
}

function AddTask({dispatch}) {
  const [addOption, setAddOption] = useState(false);
  return (
    <>
      {addOption ? (
        <AddTaskMenu setAddOption={setAddOption} dispatch={dispatch}/>
      ) : (
        <div className="add-task" onClick={() => setAddOption(true)}>
          <img src="icons/add.png" />
          Add Task
        </div>
      )}
    </>
  );
}
function AddTaskMenu({ setAddOption, dispatch }) {
  const [newTask, setNewTask] = useState({ task: "", estimated: 1 });
  function onSaveSettings(){
    newTask.task &&
      dispatch({type:"addTask",newTask:{...newTask,completed:0,id:uuidv4()}})
    setNewTask({task:"",estimated:1})
  }
  return (
    <div className="menu-container" onKeyDown={(e) => e.key === "Enter" && onSaveSettings()}>
      <input
        className="menu-container-header-input"
        placeholder="What are you working on?"
        autoFocus={true}
        value={newTask.task}
        onChange={e=>setNewTask({...newTask,task:e.target.value})}
      />
      <div className="todo-label">Estimated Pomodoros</div>
      <input className="task-settings-input" type="number" value={newTask.estimated} min={1} onChange={e=>setNewTask({...newTask,estimated:Number(e.target.value)})}/>
      <button className="up-down-btn" onClick={()=>setNewTask({...newTask,estimated:newTask.estimated+1})}>
        <img src="icons/caret-up.png" />
      </button>
      <button className="up-down-btn" onClick={()=>setNewTask({...newTask,estimated:newTask.estimated-1 >= 1 ? Number(newTask.estimated-1) : 1})}>
        <img src="icons/caret-down.png" />
      </button>
      <div className="form-actions" style={{ flexDirection: "row-reverse" }}>
        <div>
          <button
            type="button"
            className="cancel-button"
            onClick={() => setAddOption(false)}
          >
            Cancel
          </button>
          <button type="submit" className="save-button" onClick={()=>onSaveSettings()}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function CurrentTask({ currentTask, completedPomodoros, mode }) {
  return (
    <div className="current-task">
      <div style={{ opacity: 0.6 }}>
        #{mode === "pomodoro" ? completedPomodoros + 1 : completedPomodoros}
      </div>
      <div>{currentTask ? currentTask : "Time to Focus"}</div>
    </div>
  );
}

function TaskList({ tasks, currentTask, dispatch }) {
  const overallTasksProgress = tasks.reduce(function (acc, cur) {
    const progress = (cur.completed * 100) / cur.estimated;
    return acc + progress / tasks.length;
  }, 0);
  return (
    <div className="task-container">
      <div className="tasks-heading">
        <div>Tasks</div>
        <button className="btn btn-options">
          <img src="icons/options.png"></img>
        </button>
      </div>
      <Progress percentage={Math.round(overallTasksProgress)} />
      <TaskMenu tasks={tasks} currentTask={currentTask} dispatch={dispatch} />
    </div>
  );
}

function TaskMenu({ tasks, currentTask, dispatch }) {
  return (
    <TaskContainer>
      {tasks
        .map((t) => (
          <TodoItem
            todo={t}
            key={t.id}
            currentTask={currentTask}
            handleClick={() => dispatch({ type: "switchTask", id: t.id })}
            dispatch={dispatch}
          />
        ))}
    </TaskContainer>
  );
}

function TaskContainer({ children }) {
  return <div className="todo-container">{children}</div>;
}

function TodoItem({ todo, currentTask, handleClick, dispatch }) {
  const [optionsView, setOptionsView] = useState(false);
  function toggleOptions() {
    setOptionsView(!optionsView);
  }
  return (
    <>
      {optionsView ? (
        <TodoItemSettings
          dispatch={dispatch}
          toggleOptions={toggleOptions}
          todo={todo}
        />
      ) : (
        <Todo
          todo={todo}
          handleClick={handleClick}
          toggleOptions={toggleOptions}
          currentTask={currentTask}
        />
      )}
    </>
  );
}

function Todo({ todo, handleClick, toggleOptions, currentTask }) {
  const { task, completed, estimated, id } = todo;
  const selectedState = currentTask === id;
  const taskProgress = (completed * 100) / estimated;
  return (
    <div
      className={`todo-item ${selectedState ? "task-selected" : ""}`}
      onClick={handleClick}
    >
      <div
        className="todo-progress"
        style={{ width: `${taskProgress}%` }}
      ></div>
      <div className="todo-content">
        <div
          className="right-mark"
          style={
            completed >= estimated
              ? { backgroundColor: "rgb(186, 73, 73)" }
              : {}
          }
        ></div>
        <span className="title">
          {completed >= estimated ? (
            <s style={{ opacity: "0.5" }}>{task}</s>
          ) : (
            task
          )}
        </span>
        <span className="progress">
          {completed} / {estimated}
        </span>
        <div
          className="btn task-opt"
          onClick={(e) => {
            e.stopPropagation();
            toggleOptions();
          }}
        >
          <img src="icons/vertical-ellipsis.png" />
        </div>
      </div>
    </div>
  );
}

function TodoItemSettings({ toggleOptions, dispatch, todo }) {
  const [options, setOptions] = useState({
    taskTitle: todo.task,
    estimated: todo.estimated,
  });
  const { taskTitle, estimated } = options;
  function onSaveSettings() {
    if(options.taskTitle){
      dispatch({
        type: "modifyTask",
        id: todo.id,
        title: options.taskTitle,
        estimated: options.estimated,
      });
      toggleOptions();
    }
  }
  return (
    <div
      className="menu-container"
      onKeyDown={(e) => e.key === "Enter" && onSaveSettings()}
    >
      <input
        className="menu-container-header-input"
        value={taskTitle}
        onChange={(e) => setOptions({ ...options, taskTitle: e.target.value })}
        autoFocus={true}
      />
      <div>
        <div className="todo-label">Completed / Estimated Pomodoros</div>
        <div className="pomodoro-inputs">
          <div
            className="task-settings-input"
            style={{
              opacity: "0.7",
              fontWeight: 800,
              padding: "7px",
              cursor: "no-drop",
            }}
          >
            {todo.completed}
          </div>
          <span> / </span>
          <input
            className="task-settings-input"
            type="number"
            id="estimated"
            value={estimated}
            min={todo.completed}
            onChange={(e) =>
              setOptions({
                ...options,
                estimated:
                  Number(e.target.value) >= todo.completed
                    ? Number(e.target.value)
                    : options.estimated,
              })
            }
          />
          <button
            className="up-down-btn"
            onClick={() =>
              setOptions({ ...options, estimated: options.estimated + 1 })
            }
          >
            <img src="icons/caret-up.png" />
          </button>
          <button
            className="up-down-btn"
            onClick={() =>
              setOptions({
                ...options,
                estimated:
                  options.estimated - 1 >= todo.completed && options.estimated-1 >= 1
                    ? options.estimated - 1
                    : options.estimated,
              })
            }
          >
            <img
              src="icons/caret-down.png"
            
            />
          </button>
        </div>
        <div className="form-actions">
          <div>
            <button
              type="button"
              className="delete-button"
              onClick={() => dispatch({ type: "deleteTask", id: todo.id })}
            >
              Delete
            </button>
          </div>
          <div>
            <button
              type="button"
              className="cancel-button"
              onClick={toggleOptions}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
              onClick={onSaveSettings}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
