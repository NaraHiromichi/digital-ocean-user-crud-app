const API_URL = localStorage.getItem("apiUrl");
function removeChildElements() {
  let childElements = document.querySelector("#dataContainer");
  let delChild = childElements.lastChild;
  while (delChild) {
    childElements.removeChild(delChild);
    delChild = childElements.lastChild;
  }
}
const fetchData = async () => {
  const dataTag = document.querySelector("#dataContainer");
  removeChildElements();
  console.log("inside ", API_URL);
  if (API_URL) {
    const res = await fetch(`${API_URL}/users`);
    const data = await res.json();
    console.log(dataTag.innerHTML);
    dataTag.innerHTML = "";
    data.forEach((user) => {
      const userDiv = `<div
    class="w-[90vw] mt-[1em] mx-auto h-[28vh] flex justify-between items-center border-b border-white px-10 pb-[1rem]"
  >
    <div class="flex items-center justify-between">
      <img
        src="${user.pic}"
        alt="${user.name}"
        class="w-[160px] max-w-[160px] h-[160px] object-cover rounded-full"
      />
      <div class="text-center ml-[3rem] text-[36px] text-white">
        ${user.name}
      </div>
    </div>
    <div id="${user.id}" onclick="handleDeleteUser(event)">
    <i class="fa-sharp fa-solid fa-user-minus text-white text-[27px] pointer-events-none"></i>
    </div>
  </div>`;
      dataTag.innerHTML += userDiv;
    });
    console.log(data);
  } else {
    window.location.href = "/api";
  }
};

fetchData();

const handleUploadPhoto = async () => {
  const inputTag = document.querySelector("#uploadFileInput");
  const res = await fetch(`${API_URL}/uploadFile`, {
    method: "POST",
    body: inputTag.files[0],
  });
};
const handleAddName = async () => {
  const nameInputTag = document.querySelector("#nameInput");
  const res = await fetch(`${API_URL}/nameAdd`, {
    method: "POST",
    body: JSON.stringify(nameInputTag.value),
  });
};

const submitForm = async () => {
  const inputTag = document.querySelector("#avatar");
  const nameInputTag = document.querySelector("#nameInput");
  if (inputTag.files.length > 0 && nameInputTag.value) {
    errTag.classList.replace("block", "hidden");
    const formData = new FormData();
    // formData.append("name", nameInputTag.value);
    formData.append("name", nameInputTag.value)
    formData.append("file", inputTag.files[0]);
    const res = await fetch(`${API_URL}/uploadFile`, {
      method: "POST",
      body: formData,
    });
    fetchData();
  } else {
    const errTag = document.querySelector("#errTag");
    errTag.classList.replace("hidden", "block");
    if (inputTag.files.length < 1 && nameInputTag.value === "") {
      errTag.append("You need to enter name and choose image");
    } else if (nameInputTag.value === "") {
      errTag.append("You need to enter name");
    } else if (inputTag.files.length < 1) {
      errTag.append("You need to choose image");
    }
  }
};

const handleDeleteUser = async (e) => {
  const idToDelete = e.target.id;
  const res = await fetch(`${API_URL}/deleteUser`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: idToDelete }),
  });
  fetchData();
};
