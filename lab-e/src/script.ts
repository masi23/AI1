// const msg: string = "Hello!";
// alert(msg);

const linkTag = document.querySelector("link[rel='stylesheet']");

type Style = {
  name: string;
  src: string;
};

const styles: Style[] = [
  {
    name: "styl 1",
    src: "/style-1.css",
  },
  {
    name: "styl 2",
    src: "/style-2.css",
  },
  {
    name: "styl 3",
    src: "/style-3.css",
  },
];

function changeStyle(style: Style) {
  console.log("entered event!");
  if (linkTag !== null) {
    if ("href" in linkTag) {
      console.log("style changed to: ", style.src);
      linkTag.href = style.src;
    }
  }
}

const stylesWrapper = document.getElementById("stylesWrapper");
if (stylesWrapper !== null) {
  stylesWrapper.style.position = "fixed";
  stylesWrapper.style.display = "flex";
  stylesWrapper.style.flexDirection = "column";
  stylesWrapper.style.top = "20px";
  stylesWrapper.style.right = "50px";
  stylesWrapper.style.gap = "5px";
}

for (let style of styles) {
  const button = document.createElement("button");
  button.textContent = style.name;
  button.style.backgroundColor = "green";
  button.style.border = "none";
  button.style.padding = "10px 20px";
  button.addEventListener("click", (event) => {
    console.log("event listener");
    changeStyle(style);
  });
  stylesWrapper?.appendChild(button);
}
