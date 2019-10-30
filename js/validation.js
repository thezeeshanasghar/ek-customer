$(function() {

	$.validator.setDefaults({
		highlight: function(element) {
			$(element)
			.addClass('has-error')
		},

		unhighlight: function(element) {
			$(element)
			.removeClass('has-error')
		}
	})

	$.validator.addMethod('strongPassword', function(value, element) {
		return value.length >=6;
	}, 'Your password must be at least 6 charactres long.')	

	$("#register-form").validate({
		rules: {
			email: {
				required: true,
				email: true
			},

			password: {
				required: true,
				strongPassword: true
			},
			password2: {
				required: true,
				equalTo: "#password"
			},

			name: "required",

			mobNum: {
				required: true,
				number: true
			},

		},

		messages: {
			email: {
				required: 'Please enter an email address.',
				email: 'Please enter a valid email address.'
			},

			name: {
				required: 'Please enter your name.'
			},

			mobNum: {
				required: 'Please enter your mobile number.'
			},

			password: {
				required: 'Please enter a password.'
			},

			password2: {
				required: 'Please re-enter your password.'
			}
		}
	});
});