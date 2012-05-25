$(document).ready(function() {
	var $variables = $('#js-variables'),
		$variablesList = $('#js-variables-list'),
		$variablesAddBtn = $('#js-variables-list_terms-add-btn'),

		$variablesForm = $('#js-variables-form'),
		$variablesFormName = $('#js-variables-form_name'),
		$variablesFormValue = $('#js-variables-form_value'),
		$variablesFormSubmitBtn = $('#js-variables-form_btn'),

		$termsForm = $('#js-terms-form'),
		$termsFormName = $('#js-terms-form_name'),
		$termsFormValueB = $('#js-terms-form_value-b'),
		$termsFormValueC = $('#js-terms-form_value-c'),
		$termsFormSubmitBtn = $('#js-terms-form_btn');

	var $termsFakeItem = $('#js-terms-list_fake-item').clone().removeAttr('id');
	$('#js-terms-list_fake-item').remove();

	var $variablesFakeItem = $('#js-variables-list_fake-item').clone().removeAttr('id');
	$('#js-variables-list_fake-item').remove();

	function createVar(name, value) {
		$variablesList.show();
		var $item = $variablesFakeItem.clone();
		$item.find('.js-variables-list_name').text(name);
		$item.find('.js-variables-list_value').text(value);
		$item.appendTo($variablesList);
	}

	function updateVar(id, name, value) {

	}

	function removeVar(id) {

	}

	function createTerm(varId, name, valueB, valueC) {

	}

	// add variable btn click
	$variablesAddBtn.on('click', function() {
		$variablesForm.removeData('varId');

		$variablesFormName.val('');
		$variablesFormValue.val('');

		$variablesAddBtn.hide();
		$variablesForm.show().appendTo($variables);
	});

	// variables form btn click
	$variablesFormSubmitBtn.on('click', function() {
		if (!$variablesFormName.val().length) {
			return;
		}

		createVar($variablesFormName.val(), $variablesFormValue.val());
		$variablesAddBtn.show();
		$variablesForm.hide();
	});

	$variablesList.on('click', '.js-variables-list_terms-add-btn', function() {
		var $this = $(this);

		$termsForm.removeData('termId');
		$termsForm.data('varId', $this.parents('.js-variables-list_item').index());
		
		$termsFormName.val('');
		$termsFormValueB.val('');
		$termsFormValueC.val('');
		
		$this.parent().hide();
		$termsForm.show().appendTo($this.parents('.js-variables-list_terms'));
	});

	$termsFormSubmitBtn.on('click', function() {
		if (!$termsFormName.val().length || !$termsFormValueB.val().length || !$termsFormValueC.val().length) {
			return;
		}
	});
});