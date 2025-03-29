import toast from "react-hot-toast";

const toastBackgroundStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.83)",
  color: "white",
};

export function StreakToast(streak) {
  toast(
    <span>
      🔥<strong style={{ color: "rgb(216, 86, 86)" }}>{streak}</strong> days
      streak!
    </span>,
    { style: toastBackgroundStyle, duration: 5000 }
  );
}

export function AddTaskToast(task) {
  toast.success(
    <span>
      <strong style={{ color: "rgb(137, 236, 149)" }}>{task + " "}</strong>{" "}
      added
    </span>,
    {
      position: "bottom-center",
      style: toastBackgroundStyle,
    }
  );
}

export function UpdateTaskToast(task) {
  toast.success(
    <span>
      <strong style={{ color: "rgb(109, 234, 124)" }}>{task + " "}</strong>{" "}
      updated
    </span>,
    {
      position: "bottom-center",
      style: toastBackgroundStyle,
    }
  );
}

export function DeleteTaskToast(task) {
  toast.success(
    <span>
      <strong style={{ color: "rgb(230, 159, 159)" }}>{task + " "}</strong>{" "}
      deleted
    </span>,
    {
      position: "bottom-center",
      style: toastBackgroundStyle,
      iconTheme: { primary: "rgb(182, 63, 63)" },
    }
  );
}

export function CurrentTaskToast(currentTask) {
  toast.success(
    <span>
      Current task:
      <strong style={{ color: "rgb(109, 234, 124)" }}>
        {" " + currentTask}
      </strong>
    </span>,
    {
      position: "bottom-center",
      style: toastBackgroundStyle,
    }
  );
}

export function SettingsSavedToast() {
  toast.success(<span>Settings Saved</span>, {
    position: "bottom-center",
    style: toastBackgroundStyle,
  });
}

export function DeleteTimelineToast(timeline) {
  toast.success(
    <span>
      <strong style={{ color: "rgb(247, 165, 165)" }}>{timeline}</strong>{" "}
      timeline deleted
    </span>,
    {
      position: "bottom-center",
      style: toastBackgroundStyle,
      iconTheme: { primary: "rgb(223, 103, 103)" },
    }
  );
}

export function AddTimelineToast(timeline, minutes) {
  toast.success(
    <span>
      Progress saved:
      <strong style={{ color: "rgb(109, 234, 124)" }}>{" " + timeline}</strong>
      <strong>{` (${minutes})`}</strong>
    </span>,
    {
      position: "bottom-center",
      style: toastBackgroundStyle,
    }
  );
}

export function TasksFinishedToast() {
  toast.success(
    <span>
      You have finised all your tasks🎉
    </span>,
    {
      position: "bottom-center",
      style: toastBackgroundStyle,
      duration:10000
    }
  );
}
