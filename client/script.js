const url = "http://localhost:5500/cars";
const carListContainer = document.getElementById("carList");

window.addEventListener('load', fetchData);
function fetchData(){
  carListContainer.innerHTML = "";
  fetch(url)
  .then((response) => response.json())
  .then((object) => {
    const ul = document.createElement("ul");
    ul.classList.add("carList", "list-group");
    const cars = object.resources;

    cars.forEach((car) =>{
      console.log(car);
      const li = document.createElement('li');
      li.classList.add("list-group-item", 'd-flex', 'justify-content-between', 'align-items-center');
      const id = car.id;
      const data = [car.model, car.year, car.gear, car.fuel, car.color, car.mileage];
      const names = ['Modell: ', 'Modell År: ', 'Växellåda: ', 'Bränsle: ', 'Färg: ', 'Miltal: '];
      data.forEach((item, index) =>{
        const span = document.createElement('span');
        const html = names[index] + item + ' ';
        span.innerHTML = html;
        li.appendChild(span);
      });

      const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';
  editBtn.classList.add('btn', 'btn-warning', 'mx-2');
  editBtn.addEventListener('click', () => openEditModal(id)); 
  li.appendChild(editBtn);
  
      const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('btn', 'btn-danger');
  deleteBtn.addEventListener('click', () => deleteCar(id));
  li.appendChild(deleteBtn);

  ul.appendChild(li);

  
});
  
    carListContainer.appendChild(ul);
  })

  .catch((error) => {
    console.error("Error fetching cars:", error);
  });
}



function openEditModal(id) {
  console.log("editing car",id)
  fetch(`http://localhost:5500/cars/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then((car) => {
      console.log("car", car)
      const fetchcar=car.resources[0]
      // Populate modal form fields with car details
      document.getElementById('editInputModel').value = fetchcar.model;
      document.getElementById('editInputYear').value = fetchcar.year;
      document.getElementById('editInputGear').value = fetchcar.gear;
      document.getElementById('editInputFuel').value = fetchcar.fuel;
      document.getElementById('editInputColor').value = fetchcar.color;
      // Add other fields as needed

      

      // Show the Bootstrap modal
      const modal = new bootstrap.Modal(document.getElementById('editCarModal'));
      modal.show();
    })
    .catch((error) => {
      console.error('Error fetching or parsing car details:', error);
    });
}


function deleteCar(id) {
  fetch(`http://localhost:5500/cars/${id}`, {
    method: 'DELETE'
  })
    .then((response) => {
      if (response.ok) {
        console.log(`Car with ID ${id} has been deleted.`);
        fetchData(); // Refresh the car list after deletion
      } else {
        console.error(`Failed to delete car with ID ${id}.`);
      }
    })
    .catch((error) => {
      console.error('Error deleting car:', error);
    });
}

// submit

const form = document.getElementById("carForm");
form.addEventListener('submit', (e) => {
  e.preventDefault();
  submitForm();
});

function submitForm() {
console.log("hejhej")
  const model = document.getElementById("inputModel").value;
  const year = document.getElementById("inputYear").value;
  const gear = document.getElementById("inputGear").value;
  const fuel = document.getElementById("inputFuel").value;
  const color = document.getElementById("inputColor").value;
  const mileage = document.getElementById("inputMileage").value;

  fetch('http://localhost:5500/cars',{
    method: "POST",
    headers: {'Content-Type' : 'application/json'},
    body: JSON.stringify({
      model: model,
      year: year,
      gear: gear,
      fuel: fuel,
      color: color,
      mileage: mileage,
    })
  })
  .then(response => response.json())
  .then(data =>{
    if(data.error){
      console.error(error,"hej");
    }else{
      console.log("Det funka!");
      console.log(`${data.message} with an id of: ${data.id}`);
      fetchData();
    }
  })
  .catch(error =>{
    console.error(error, "hejhej");
  })

}


function clearFields() {
  document.getElementById("inputModel").value = "";
  document.getElementById("inputYear").value = "";
  document.getElementById("inputGear").value = "";
  document.getElementById("inputFuel").value = "";
  document.getElementById("inputColor").value = "";
  document.getElementById("inputMileage").value = "";
  console.log("Fields cleared!");
}
const clearButton = document.querySelector("#carForm button.btn-danger");
clearButton.addEventListener("click", function(e) {
  console.log('whatsapp');
  e.preventDefault();
  clearFields();
});



//  MODAL
document.getElementById('carForm').addEventListener('submit', function(event) {
  event.preventDefault(); 


  var myModal = new bootstrap.Modal(document.getElementById('myModal'), {});
  myModal.show();

 
  var closeTimeout = setTimeout(function() {
    myModal.hide();
  }, 20000); // Sekunderna är bugg

  
  document.getElementById('closeModalBtn').addEventListener('click', function() {
    clearTimeout(closeTimeout);
    myModal.hide();
  });
});



