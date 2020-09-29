let dueDate = Todoist.newTaskCreated.DueDate.toString();
let dueTime;
let hour;
let minutes;
let newDueDate;

if (dueDate.indexOf(' at ') > -1) {
  dueTime = dueDate.split(' at ')[1];
  dueDate = dueDate.split(' at ')[0];

  hour =  parseInt(dueTime.split(':')[0]);
  minutes = dueTime.split(':')[1];
  if (minutes.indexOf('PM') > -1) {
    // PM
    hour = 1 * hour + 12;
    minutes = minutes.split('PM').join('');
  } else {
    // AM
    minutes = minutes.split('AM').join('');
  }
  newDueDate = `${dueDate} ${hour}:${minutes}`;
  
  const TaskContent = Todoist.newTaskCreated.TaskContent.toString();
  const LinkToTask  = Todoist.newTaskCreated.LinkToTask.toString();
  const Project     = Todoist.newTaskCreated.Project.toString();
  const Labels      = Todoist.newTaskCreated.Labels.toString();
  const Priority    = Todoist.newTaskCreated.Priority.toString();
  const CreatedAt   = Todoist.newTaskCreated.CreatedAt.toString();

  const row = `${TaskContent} ||| ${Project} ||| ${CreatedAt} ||| ${Labels} ||| ${Priority} ||| ${LinkToTask} ||| ${newDueDate}`;

  GoogleSheets.appendToGoogleSpreadsheet.setFormattedRow(row);
}