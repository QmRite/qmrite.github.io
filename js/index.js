document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const nameField = document.getElementById('name');
    const dobField = document.getElementById('dob');
    const emailField = document.getElementById('email');
    const topicField = document.getElementById('topic');

    let isValid = true;

    if (nameField.value.trim() === '') {
        nameField.classList.add('invalid');
        nameField.classList.remove('valid');
        isValid = false;
    } else {
        nameField.classList.remove('invalid');
        nameField.classList.add('valid');
    }

    const dobValue = new Date(dobField.value);
    if (!dobValue || dobValue >= new Date()) {
        dobField.classList.add('invalid');
        dobField.classList.remove('valid');
        isValid = false;
    } else {
        dobField.classList.remove('invalid');
        dobField.classList.add('valid');
    }

    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if (!emailField.value.match(emailPattern)) {
        emailField.classList.add('invalid');
        emailField.classList.remove('valid');
        isValid = false;
    } else {
        emailField.classList.remove('invalid');
        emailField.classList.add('valid');
    }

    if (topicField.value.trim() === '') {
        topicField.classList.add('invalid');
        topicField.classList.remove('valid');
        isValid = false;
    } else {
        topicField.classList.remove('invalid');
        topicField.classList.add('valid');
    }

    if (isValid) {
        alert(`Name: ${nameField.value}\nDate of Birth: ${dobField.value}\nEmail: ${emailField.value}\nTopic: ${topicField.value}`);
    }
});