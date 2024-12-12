import { EmojiButton } from "./emji.js";
var butt = document.querySelector('.emojisicons')
var messageinput = document.getElementById('messageinput');
var picker = new EmojiButton();
butt.addEventListener('click', () => picker.togglePicker(butt));
picker.on('emoji', ({emoji}) => {
  messageinput.value += emoji;
});