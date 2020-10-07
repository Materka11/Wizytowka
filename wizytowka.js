//zmienne
const a1 = document.querySelector(".firstA");
const a2 = document.querySelector(".secondA");
const a3 = document.querySelector(".thirdA");
const line = document.querySelector("#line");
//animacja menu
a1.addEventListener("mouseover", function(){
    line.classList.toggle("mouseoverFirstA");
});

a1.addEventListener("mouseout", function(){
    line.classList.remove("mouseoverFirstA");
})

a2.addEventListener("mouseover", function(){
    line.classList.toggle("mouseoverSecondA");
});

a2.addEventListener("mouseout", function(){
    line.classList.remove("mouseoverSecondA");
})

a3.addEventListener("mouseover", function(){
    line.classList.toggle("mouseoverThirdA");
});

a3.addEventListener("mouseout", function(){
    line.classList.remove("mouseoverThirdA");
})
/*$(document).ready(function() { 

	$('a[href^="#"]').on('click', function(event) {
	
		const target = $( $(this).attr('href') );
	
		if( target.length ) {
			event.preventDefault();
			$('html, body').animate({
				scrollTop: target.offset().top
			}, 1000);
		}
        
        
	});

});*/
//scroll o 100vh w menu 
$(document)
    .on('click', '.firstA', function(e) {
        e.preventDefault();
        const x = $(window).scrollTop() + $(window).height();
        $('html, body')
            .animate({
                scrollTop: x}, function() {});
    })

$(document)
    .on('click', '.secondA', function(e) {
        e.preventDefault();
        const x = $(window).scrollTop() + $(window).height();
        $('html, body')
            .animate({
                scrollTop: x * 3.6}, function() {});
    })

$(document)
    .on('click', '.thirdA', function(e) {
        e.preventDefault();
        const x = $(window).scrollTop() + $(window).height();
        $('html, body')
            .animate({
                scrollTop: x * 7.2}, function() {});
    })

$(function () { 
            const footer = $(".footer"); 
            $(window).scroll(function () { 
                const scroll = $(window).scrollTop(); 
  
                if (scroll >= 3750) { 
                    footer.addClass("display");
                } else {
                    footer.removeClass("display");
                }
            }); 
        }); 

//formularz
function removeFieldError(field) {
    const errorText = field.nextElementSibling;
    if (errorText !== null) {
        if (errorText.classList.contains("form-error-text")) {
            errorText.remove();
        }
    }
};

function createFieldError(field, text) {
    removeFieldError(field); //przed stworzeniem usuwam by zawsze był najnowszy komunikat

    const div = document.createElement("div");
    div.classList.add("form-error-text");
    div.innerText = text;
    if (field.nextElementSibling === null) {
        field.parentElement.appendChild(div);
    } else {
        if (!field.nextElementSibling.classList.contains("form-error-text")) {
            field.parentElement.insertBefore(div, field.nextElementSibling);
        }
    }
};

function toggleErrorField(field, show) {
    const errorText = field.nextElementSibling;
    if (errorText !== null) {
        if (errorText.classList.contains("form-error-text")) {
            errorText.style.display = show ? "block" : "none";
            errorText.setAttribute('aria-hidden', show);
        }
    }
};

function markFieldAsError(field, show) {
    if (show) {
        field.classList.add("field-error");
    } else {
        field.classList.remove("field-error");
        toggleErrorField(field, false);
    }
};

//pobieram elementy
const form = document.querySelector("#contactForm");
const inputs = form.querySelectorAll("[required]");

form.setAttribute("novalidate", true);

//etap 1 : podpinam eventy
for (const el of inputs) {
    el.addEventListener("input", e => markFieldAsError(e.target, !e.target.checkValidity()));
}

form.addEventListener("submit", e => {
    e.preventDefault();

    let formErrors = false;

    //2 etap - sprawdzamy poszczególne pola gdy ktoś chce wysłać formularz
    for (const el of inputs) {
        removeFieldError(el);
        el.classList.remove("field-error");

        if (!el.checkValidity()) {
            createFieldError(el, el.dataset.errorText);
            el.classList.add("field-error");
            formHasErrors = true;
        }
    }

    if (!formErrors) {
        const submit = form.querySelector("[type=submit]");
        submit.disabled = true;
        submit.classList.add("loading");
        //generuję dane do wysyłki
        const formData = new FormData();
        for (const el of inputs) {
            formData.append(el.name, el.value);
        }
        
        const url = form.getAttribute("action"); //pobieramy adres wysyłki z action formularza
        const method = form.getAttribute("method"); //tak samo metodę

        fetch(url, {
            method: method,
            body: formData
        })
        .then(res => res.json())
        .then(res => {
           if (res.errors) { //błędne pola
                const selectors = res.errors.map(el => `[name="${el}"]`);
                const fieldsWithErrors = form.querySelectorAll(selectors.join(","));
                for (const el of fieldsWithErrors) {
                    markFieldAsError(el, true);
                    toggleErrorField(el, true);
                }
            } else { //pola są ok - sprawdzamy status wysyłki
                if (res.status === "ok") {
                    const div = document.createElement("div");
                    div.classList.add("form-send-success");
                    div.innerText = "Wysłanie wiadomości się nie powiodło";

                    form.parentElement.insertBefore(div, form);
                    div.innerHTML = `
                        <strong>Wiadomość została wysłana</strong>
                        <span>Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej</span>
                    `;
                    form.remove();
                }
                if (res.status === "error") {
                    //jeżeli istnieje komunikat o błędzie wysyłki
                    //np. generowany przy poprzednim wysyłaniu formularza
                    //usuwamy go, by nie duplikować tych komunikatów
                    const statusError = document.querySelector(".send-error");
                    if (statusError) {
                        statusError.remove();
                    }

                    const div = document.createElement("div");
                    div.classList.add("send-error");
                    div.innerText = "Wysłanie wiadomości się nie powiodło";
                    submit.parentElement.appendChild(div);
                }
            }
        }).catch(() => {
            submit.disabled = false;
            submit.classList.remove("loading");
        });
    }
});