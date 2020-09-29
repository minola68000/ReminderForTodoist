const url = 'https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXXXXXX/exec';
MakerWebhooks.makeWebRequest.setUrl(`${url}?command=delete&id=${Todoist.newCompletedTask.LinkToTask}&hash=dummy`);