export const initialIsOpenState = {
  settings: false,
  reports: false,
};

export function isOpenReducer(isOpenState, action) {
    switch (action.type) {
      case "toggleMenu":
        return {
          ...isOpenState,
          [action.menu]: !isOpenState[action.menu],
        };
    }
  }