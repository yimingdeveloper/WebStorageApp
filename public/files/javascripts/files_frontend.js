console.log('Front!');

const divFiles = document.querySelector('#files');

async function deleteFile(file) {
  // Default options are marked with *
  const resRaw = await fetch('/deleteFile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(file), // body data type must match "Content-Type" header
  });
  const res = await resRaw.json(); // parses JSON response into native JavaScript objects

  console.log('delete', res);

  reloadFiles();
}

function renderFile(file) {
  const divFile = document.createElement('div');

  divFile.className = 'file card p-1 col-3';

  const divName = document.createElement('div');
  divName.textContent = file.name;
  divFile.appendChild(divName);

  const imgUrl = document.createElement('img');
  var index = file.url.lastIndexOf('.');
  var ext = file.url.substr(index + 1);
  if (ext == 'jpg' || ext == 'png') {
    console.log('file:', file);
    imgUrl.setAttribute('src', file.url);
  } else {
    imgUrl.setAttribute('src', '/files/images/default_icon.png');
  }
  imgUrl.setAttribute('height', '200px');
  divFile.appendChild(imgUrl);

  const btnPreview = document.createElement('button');
  btnPreview.textContent = 'Preview';
  btnPreview.className = 'btn btn-primary';
  btnPreview.addEventListener('click', function () {
    console.log('ddd');
    window.open(file.url, '_blank');
  });
  divFile.appendChild(btnPreview);

  const btnDownload = document.createElement('button');
  btnDownload.textContent = 'Download';
  btnDownload.className = 'btn btn-success';
  btnDownload.addEventListener('click', () => downloadFile(file));
  divFile.appendChild(btnDownload);

  const btnDelete = document.createElement('button');
  btnDelete.textContent = 'Delete';
  btnDelete.className = 'btn btn-danger';
  btnDelete.addEventListener('click', () => deleteFile(file));
  divFile.appendChild(btnDelete);

  divFiles.appendChild(divFile);
}

async function reloadFiles() {
  divFiles.innerHTML = '';
  const resRaw = await fetch('/getFiles');
  const res = await resRaw.json();

  console.log('Got data', res);

  res.files.forEach(renderFile);
}

async function downloadFile(file) {
  const resRaw = await fetch('/downloadFile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
    body: JSON.stringify(file),
  }).then((res) =>
    res.blob().then((blob) => {
      console.log(file);
      var a = document.createElement('a');
      document.body.appendChild(a); //Compatibility for firefox, add tag of <a> to body
      var url = window.URL.createObjectURL(blob);
      a.href = url;

      var regexp = /(?!.*\/).*/;
      var result = file.url.match(regexp);
      a.download = result[0];
      a.target = '_blank';
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
  );
  console.log(resRaw);
}

async function fetchUserName() {
  const response = await fetch('/getCurrentUser');
  const res = await response.json();
  console.log(res.result);
  document.getElementById('username').textContent = res.result.userName;
}

window.onload = function () {
  document
    .getElementById('logoutButton')
    .addEventListener('click', async function () {
      await fetch('/logout', {
        method: 'POST',
      });
      window.location.replace('/');
    });
  fetchUserName();
};

reloadFiles();
