const participants_div = document.getElementsByClassName("participants")[0];

export const addParticipant = (participant, isMe = false) => {
  const p = document.createElement("p");
  p.id = participant.id;
  p.innerHTML = `${participant.userName}`;
  if (isMe) {
    p.innerHTML += " (You)";
  }
  participants_div.append(p);
};

const removeParticipant = (id) => {
  const participant = document.getElementById(id);
  participant.remove();
};

// export { addParticipant, removeParticipant };
