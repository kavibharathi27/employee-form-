document.addEventListener('DOMContentLoaded', function() {
    const showButtons = document.querySelectorAll('.show-form');
    const forms = document.querySelectorAll('.form');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const submitBtn = document.getElementById('submitBtn');
    const acknowledgmentForm = document.getElementById('acknowledgmentForm');
    const acknowledgmentCheckboxes = acknowledgmentForm.querySelectorAll('input[type="checkbox"]');
    const guardianRadio = document.getElementById('guardian');
    const parentRadio = document.getElementById('parent');
    const guardianInfoFields = document.querySelectorAll('.guardian-info');

    function showForm(target) {
        forms.forEach(form => {
            if (form.id === `${target}Form`) {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
        });
    }

    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let valid = true;
        let errorMessage = '';

        inputs.forEach(input => {
            if (!input.value || !input.checkValidity()) {
                valid = false;
                errorMessage += `Please fill in the ${input.previousElementSibling.textContent}\n`;
            }
        });

        const namePattern = /^[A-Za-z\s]+$/;
        const employeeName = form.querySelector('#employeeName');
        const guardianName = form.querySelector('#guardianName');

        if (employeeName && !namePattern.test(employeeName.value)) {
            valid = false;
            errorMessage += 'Employee Name should contain only letters and spaces\n';
        }
        if (guardianName && guardianName.value && !namePattern.test(guardianName.value)) {
            valid = false;
            errorMessage += 'Guardian Name should contain only letters and spaces\n';
        }

        const personalPhone = form.querySelector('#personalPhone');
        const alternatePhone = form.querySelector('#alternatePhone');
        const personalEmail = form.querySelector('#personalEmail');
        const alternateEmail = form.querySelector('#alternateEmail');

        const phonePattern = /^\d{10}$/;
        if (personalPhone && (!phonePattern.test(personalPhone.value) || (alternatePhone && personalPhone.value === alternatePhone.value))) {
            valid = false;
            errorMessage += 'Personal Phone number should be exactly 10 digits and different from Alternate Phone number\n';
        }
        if (alternatePhone && alternatePhone.value && !phonePattern.test(alternatePhone.value)) {
            valid = false;
            errorMessage += 'Alternate Phone number should be exactly 10 digits\n';
        }
        if (personalEmail && alternateEmail && personalEmail.value === alternateEmail.value) {
            valid = false;
            errorMessage += 'Personal Email and Alternate Email should be different\n';
        }

        if (!valid) {
            alert(errorMessage);
        }

        return valid;
    }

    showButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            showForm(target);
        });
    });

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentForm = this.closest('.form');
            if (validateForm(currentForm)) {
                const target = this.getAttribute('data-target');
                showForm(target);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            showForm(target);
        });
    });

    guardianRadio.addEventListener('change', function() {
        if (this.checked) {
            guardianInfoFields.forEach(field => field.style.display = 'block');
        }
    });

    parentRadio.addEventListener('change', function() {
        if (this.checked) {
            guardianInfoFields.forEach(field => field.style.display = 'none');
        }
    });

    acknowledgmentCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            let allChecked = true;
            acknowledgmentCheckboxes.forEach(cb => {
                if (!cb.checked) {
                    allChecked = false;
                }
            });
            submitBtn.disabled = !allChecked;
        });
    });

    submitBtn.addEventListener('click', function() {
        const formData = {};
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                formData[input.id] = input.value;
            });
        });

        const formDataString = JSON.stringify(formData, null, 2);
        const blob = new Blob([formDataString], { type: 'application/json' });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'info/form_data.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});
