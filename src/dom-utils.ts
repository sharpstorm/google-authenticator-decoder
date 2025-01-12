export const getDOMElementById = <T extends HTMLElement>(id: string): T => {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Failed to find DOM element ${id}`);
  }

  return element as T;
};
