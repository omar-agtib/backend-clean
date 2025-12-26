// ws/rooms.js
function projectRoom(projectId) {
  return `project:${projectId}`;
}

function userRoom(userId) {
  return `user:${userId}`;
}

module.exports = { projectRoom, userRoom };
