$(document).ready(function() {
	var $variables = $('#js-variables'),
		$variablesList = $('#js-variables-list'),
		$variablesAdd = $('#js-variables_add'),
		$variablesAddBtn = $('#js-variables_add-btn'),

		$variablesForm = $('#js-variables-form'),
		$variablesFormName = $('#js-variables-form_name'),
		$variablesFormValue = $('#js-variables-form_value'),
		$variablesFormSubmitBtn = $('#js-variables-form_btn'),

		$termsForm = $('#js-terms-form'),
		$termsFormName = $('#js-terms-form_name'),
		$termsFormValueB = $('#js-terms-form_value-b'),
		$termsFormValueC = $('#js-terms-form_value-c'),
		$termsFormSubmitBtn = $('#js-terms-form_btn'),

		$rules = $('#js-rules'),
		$rulesList = $('#js-rules-list'),
		$rulesAddBtn = $('#js-rules_add-btn');

	// getting fake var and fake term from DOM
	var $termsFakeItem = $('#js-terms-list_fake-item').clone().removeAttr('id');
	$('#js-terms-list_fake-item').remove();

	var $variablesFakeItem = $('#js-variables-list_fake-item').clone().removeAttr('id');
	$('#js-variables-list_fake-item').remove();

	var $conditionsFakeItem = $('#js-conditions-list_fake-item').clone().removeAttr('id');
	$('#js-conditions-list_fake-item').remove();

	var $rulesFakeItem = $('#js-rules-list_fake-item').clone().removeAttr('id');
	$('#js-rules-list_fake-item').remove();

	// Methods for manipulating with vars and terms
	function createVar(name, value) {
		$variablesList.show();
		var $item = $variablesFakeItem.clone();
		$item.find('.js-variables-list_name').text(name);
		$item.find('.js-variables-list_value').text(value);
		$item.data('itemData', {
			name: name,
			value: value
		});
		$item.appendTo($variablesList);
	}

	function updateVar(id, name, value) {
		var $item = $('.js-variables-list_item').eq(id);
		$item.find('.js-variables-list_name').text(name);
		$item.find('.js-variables-list_value').text(value);
		$item.data('itemData', {
			name: name,
			value: value
		});
	}

	function removeVar(id) {
		$('.js-variables-list_item').eq(id).remove();
	}

	function createTerm(varId, name, valueB, valueC) {
		var $termsList = $('.js-variables-list_item').eq(varId).find('.js-terms-list.terms-list').show();
		var $item = $termsFakeItem.clone();
		$item.find('.js-terms-list_name').text(name);
		$item.find('.js-terms-list_value-b').text(valueB);
		$item.find('.js-terms-list_value-c').text(valueC);
		$item.data('itemData', {
			name: name,
			valueB: valueB,
			valueC: valueC
		});
		$item.appendTo($termsList);
	}

	function updateTerm(varId, termId, name, valueB, valueC) {
		var $varItem = $('.js-variables-list_item').eq(varId);
		var $item = $varItem.find('.js-terms-list_item').eq(termId);
		$item.find('.js-terms-list_name').text(name);
		$item.find('.js-terms-list_value-b').text(valueB);
		$item.find('.js-terms-list_value-c').text(valueC);
		$item.data('itemData', {
			name: name,
			valueB: valueB,
			valueC: valueC
		});
	}

	function removeTerm(varId, termId) {
		var $varItem = $('.js-variables-list_item').eq(varId);
		$varItem.find('.js-terms-list_item').eq(termId).remove();
	}

	function initDrops() {
		$('.js-if-conditions-list .js-conditions-list_variable, .js-then-conditions-list .js-conditions-list_variable').droppable({
			accept: '.js-variables-list_name',
			drop: function(e, data) {
				var $this = $(this);
				var $conditionsList = $this.parents('.js-if-conditions-list');
				if ($conditionsList.length) {
					$conditionsList.append($conditionsFakeItem.clone());
					initDrops();
				}
				$this.after(data.draggable.clone().data('itemData',
					data.draggable.parents('.js-variables-list_item').data('itemData'))).remove();
			}
		});

		$('.js-if-conditions-list .js-conditions-list_term, .js-then-conditions-list .js-conditions-list_term').droppable({
			accept: '.js-terms-list_name',
			drop: function(e, data) {
				$(this).after(data.draggable.clone().data('itemData',
					data.draggable.parents('.js-terms-list_item').data('itemData'))).remove();
			}
		});
	}

	// add variable btn click
	$variablesAddBtn.on('click', function() {
		$variablesForm.removeData('varId');

		$variablesFormName.val('');
		$variablesFormValue.val('');

		$('.js-variables-list_item-inner').show();

		$variablesAdd.hide();
		$variablesForm.show().appendTo($variables);
		$variablesFormName.focus();
	});

	// variables form submit btn click
	$variablesFormSubmitBtn.on('click', function() {
		if (!$variablesFormName.val().length) {
			return;
		}

		var varId = $variablesForm.data('varId');
		if (typeof(varId) === 'undefined') {
			createVar($variablesFormName.val(), $variablesFormValue.val());
			$variablesAdd.show();
			$( "#js-variables .js-variables-list_name" ).draggable({helper: "clone" });
		} else {
			updateVar(varId, $variablesFormName.val(), $variablesFormValue.val());
			$('.js-variables-list_item-inner').show();
		}
		$variablesForm.hide();
	});

	// variables edit btn click
	$variablesList.on('click', '.js-variables-list_edit-btn', function() {
		var $this = $(this);
		var $item = $this.parents('.js-variables-list_item');
		var itemData = $item.data('itemData');

		$variablesForm.data('varId', $item.index());

		$variablesAdd.show();

		$variablesFormName.val(itemData.name);
		$variablesFormValue.val(itemData.value);

		$this.parent().after($variablesForm.show()).hide();
		$variablesFormName.focus();
	});

	// variable remove btn click
	$variablesList.on('click', '.js-variables-list_remove-btn', function() {
		$variables.append($termsForm.hide()).append($variablesForm.hide());
		$('.js-variables-list_item-inner').show();
		$('.js-terms-list_item-inner').show();
		$variablesAdd.show();
		$('.js-variables-list_terms-add').show();

		removeVar($(this).parents('.js-variables-list_item').index());

		if (!$('.js-variables-list_item').length) {
			$variablesList.hide();
		}
	});

	// add term btn click
	$variablesList.on('click', '.js-variables-list_terms-add-btn', function() {
		var $this = $(this);

		$('.js-variables-list_terms-add').show();

		$termsForm.removeData('termId');
		$termsForm.data('varId', $this.parents('.js-variables-list_item').index());
		
		$termsFormName.val('');
		$termsFormValueB.val('');
		$termsFormValueC.val('');
		
		$this.parent().hide();
		$termsForm.show().appendTo($this.parents('.js-variables-list_terms'));
		$termsFormName.focus();
	});

	// terms form submit btn click
	$termsFormSubmitBtn.on('click', function() {
		if (!$termsFormName.val().length) {
			return;
		}

		var varId = $termsForm.data('varId');
		var termId = $termsForm.data('termId');
		if (typeof(termId) === 'undefined') {
			createTerm(varId, $termsFormName.val(), $termsFormValueB.val(), $termsFormValueC.val());
			$('.js-variables-list_item').eq(varId).find('.js-variables-list_terms-add').show();
			$('.js-variables-list_item').eq(varId).find('.js-terms-list_name').draggable({helper: "clone" });
		} else {
			updateTerm(varId, termId, $termsFormName.val(), $termsFormValueB.val(), $termsFormValueC.val());
			$('.js-variables-list_item').eq(varId).find('.js-terms-list_item-inner').show();
		}

		$termsForm.hide();
	});

	// term edit btn click
	$variablesList.on('click', '.js-terms-list_edit-btn', function() {
		var $this = $(this);
		var $varItem = $this.parents('.js-variables-list_item');
		var $termItem = $this.parents('.js-terms-list_item');
		var itemData = $termItem.data('itemData');

		$termsForm.data('varId', $varItem.index());
		$termsForm.data('termId', $termItem.index());

		$('.js-terms-list_item-inner').show();
		$('.js-variables-list_terms-add').show();

		$termsFormName.val(itemData.name);
		$termsFormValueB.val(itemData.valueB);
		$termsFormValueC.val(itemData.valueC);

		$this.parent().after($termsForm.show()).hide();
		$termsFormName.focus();
	});

	// term remove btn click
	$variablesList.on('click', '.js-terms-list_remove-btn', function() {
		$variables.append($termsForm.hide());
		var $this = $(this);
		var $varItem = $this.parents('.js-variables-list_item');
		var $termItem = $this.parents('.js-terms-list_item');

		$('.js-terms-list_item-inner').show();
		$('.js-variables-list_terms-add').show();

		removeTerm($varItem.index(), $termItem.index());

		if (!$varItem.find('.js-terms-list_item').length) {
			$varItem.find('.js-terms-list').hide();
		}
	});

	$rulesAddBtn.on('click', function() {
		$item = $rulesFakeItem.clone();
		$item.find('.js-if-conditions-list').append($conditionsFakeItem.clone());
		$item.find('.js-then-conditions-list').append($conditionsFakeItem.clone());
		$rulesList.show().append($item);
		initDrops();
	});

	function getKnowledgeBase() {
		var knowledgeBase = [], knowledgeBaseItem, conditions;

		$rules.find('.js-rules-list_item').each(function() {
			var $ifConditionsItems = $(this).find('.js-if-conditions-list .js-conditions-list_item');
			var $thenConditionsItems = $(this).find('.js-then-conditions-list .js-conditions-list_item');
			var $varItem, $termItem;
			if ($ifConditionsItems.find('.js-variables-list_name').length && $thenConditionsItems.find('.js-variables-list_name').length) {
				knowledgeBaseItem = {
					output: {},
					rules: []
				};
				conditions = [];
				$ifConditionsItems.each(function() {
					$varItem = $(this).find('.js-variables-list_name');
					$termItem = $(this).find('.js-terms-list_name');
					if ($varItem.length) {
						conditions.push({
							linguisticVariable: $varItem.data('itemData').name,
							term: $termItem.data('itemData').name
						});
					}
				});
				knowledgeBaseItem.rules.push(conditions);
				knowledgeBaseItem.output.linguisticVariable = $thenConditionsItems.find('.js-variables-list_name').data('itemData').name;
				knowledgeBaseItem.output.term = $thenConditionsItems.find('.js-terms-list_name').data('itemData').name;
				knowledgeBase.push(knowledgeBaseItem);
			}
		});

		return knowledgeBase;
	}

	function getLinguisticVariables() {
		var linguisticVariables = [], linguisticVariablesItem, $this, data;

		$variables.find('.js-variables-list_item').each(function() {
			$this = $(this);
			linguisticVariablesItem = {
				name: $this.data('itemData').name,
				terms: []
			};
			$this.find('.js-terms-list_item').each(function() {
				data = $(this).data('itemData');
				linguisticVariablesItem.terms.push({
					name: data.name,
					b: data.valueB,
					c: data.valueC
				});
			});
			linguisticVariables.push(linguisticVariablesItem);
		});
		return linguisticVariables;
	}

	function getVariablesValues() {
		var values = [], data;
		$variables.find('.js-variables-list_item').each(function() {
			data =  $(this).data('itemData');
			if (data.value.length) {
				values.push({
					linguisticVariable: data.name,
					value: data.value
				});
			}
		});
		return values;
	}

	$('#js-process').on('click', function() {
		var knowledgeBase = getKnowledgeBase();
		var linguisticVariables = getLinguisticVariables();
		var values = getVariablesValues();
		console.log({
			method: 'discreteOutput',
			input: {
				linguisticVariables: linguisticVariables,
				knowledgeBase: knowledgeBase,
				values: values
			}
		});
	});

	initDrops();
});