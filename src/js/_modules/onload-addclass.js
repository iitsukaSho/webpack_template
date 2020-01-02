export default function onLoadAddClass(addClassList) {
  const addClassName01 = Object.keys(addClassList);
  addClassName01.forEach((data) => {
    for (let addClassItem of addClassList[data]) {
      addClassItem.classList.toggle(data);
    }
  });
}