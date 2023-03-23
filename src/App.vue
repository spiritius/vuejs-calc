<template>
	<div class="calc">
		<div class="calc__output">
			<div
				v-if="error"
				class="calc__output_error">
				error
			</div>
			<p>
				{{ val1 }}
				<span class="calc__output_action">{{ actionSign }}</span>
			</p>
			<p v-if="step !== 'init'">{{ val2 }}</p>
			<p
				v-if="resultGot"
				class="calc__output_result">
				{{ result }}
			</p>
		</div>
		<div class="calc__input">
			<button
				@click="clean()"
				class="btn-special">
				C
			</button>
			<button
				@click="toggleSign()"
				class="btn-special">
				±
			</button>
			<button
				@click="addPercent()"
				class="btn-special">
				%
			</button>
			<button
				@click="addAction('divide')"
				class="btn-operation">
				÷
			</button>
			<button @click="addNum(7)">7</button>
			<button @click="addNum(8)">8</button>
			<button @click="addNum(9)">9</button>
			<button
				@click="addAction('multiply')"
				class="btn-operation">
				×
			</button>
			<button @click="addNum(4)">4</button>
			<button @click="addNum(5)">5</button>
			<button @click="addNum(6)">6</button>
			<button
				@click="addAction('subtract')"
				class="btn-operation">
				−
			</button>
			<button @click="addNum(1)">1</button>
			<button @click="addNum(2)">2</button>
			<button @click="addNum(3)">3</button>
			<button
				@click="addAction('add')"
				class="btn-operation">
				+
			</button>
			<button
				@click="addNum(0)"
				class="btn-wide">
				0
			</button>
			<button @click="addDot()">.</button>
			<button
				@click="getResult()"
				class="btn-operation">
				=
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				currentVal: 0,
				val1: 0,
				val2: 0,
				result: 0,
				resultGot: false,
				action: '',
				actionSign: '',
				error: false,
				step: 'init', // init - recording first value, operator - recording second value after op's button
			};
		},
		methods: {
			addNum(val) {
				if (this.currentVal === 0) {
					this.currentVal = val;
				} else {
					this.currentVal = parseFloat(
						this.currentVal.toString() + val.toString()
					);
				}
				if (this.resultGot) {
					this.clean();
					this.currentVal = val;
					this.resultGot = false;
				}

				this.writeVal();
			},
			writeVal() {
				switch (this.step) {
					case 'init':
						this.val1 = this.currentVal;
						break;
					case 'operator':
						this.val2 = this.currentVal;
						break;
				}
			},
			addDot() {
				if (!this.currentVal.toString().includes('.')) {
					this.currentVal = this.currentVal.toString() + '.';

					if (this.step === 'init') {
						this.val1 = this.currentVal;
					} else {
						this.val2 = this.currentVal;
					}
				}
			},
			toggleSign() {
				if (this.step === 'operator' && this.resultGot) {
					this.result = this.result * -1;
					return;
				}

				this.currentVal = this.currentVal * -1;
				this.writeVal();
			},
			addPercent() {
				this.action = 'percent';
				this.getResult();
			},
			addAction(action) {
				// pressing the operator button again
				if (this.step === 'operator' && this.val2 !== 0) {
					this.returnResult();
					this.val1 = this.result;
					this.val2 = 0;
				}

				// save the operation type
				this.action = action;

				if (!this.resultGot) {
					// first iteration of calculations
					this.step = 'operator';
					this.currentVal = 0;
				} else {
					// proceed working with result after pressing '='
					this.val1 = this.result;
					this.val2 = 0;
					this.result = 0;
					this.step = 'operator';
					this.resultGot = false;
				}
			},
			getResult() {
				this.currentVal = 0;

				// after press '=' again
				if (this.resultGot) {
					this.val1 = this.result;
				}

				this.returnResult();
				this.resultGot = true;
			},
			returnResult() {
				// in case of floating dot at end
				this.val1 = parseFloat(this.val1);
				this.val2 = parseFloat(this.val2);

				switch (this.action) {
					case 'add':
						this.result = this.val1 + this.val2;
						break;
					case 'divide':
						this.result =
							Math.round((this.val1 / this.val2) * 1000000) /
							1000000;
						break;
					case 'multiply':
						this.result =
							Math.round(this.val1 * this.val2 * 1000000) /
							1000000;
						break;
					case 'subtract':
						this.result = this.val1 - this.val2;
						break;
					case 'percent':
						this.result = (this.val1 * this.val2) / 100;
						break;
				}

				if (!Number.isFinite(this.result)) {
					this.error = true;
				}
			},
			clean() {
				this.currentVal = 0;
				this.val1 = 0;
				this.val2 = 0;
				this.result = 0;
				this.action = '';
				this.actionSign = '';
				this.step = 'init';
				this.resultGot = false;
				this.error = false;
			},
		},
		watch: {
			action(newValue) {
				// visual display of operation's type
				switch (newValue) {
					case 'add':
						this.actionSign = '+';
						break;
					case 'divide':
						this.actionSign = '÷';
						break;
					case 'multiply':
						this.actionSign = '∗';
						break;
					case 'subtract':
						this.actionSign = '−';
						break;
					case 'percent':
						this.actionSign = '%';
						break;
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.calc {
		width: 320px;
		height: auto;
		background-color: #000;
		color: #fff;
		border-radius: 2rem;
		padding: 1rem;
		font-family: sans-serif;
		font-size: 1.4rem;
		line-height: 1;

		&__output {
			width: 100%;
			height: 4 * 1.8rem;
			display: flex;
			flex-direction: column;
			text-align: right;
			align-items: end;
			justify-content: end;
			margin-bottom: 1rem;
			padding-right: 1.2rem;
			font-size: 2.2rem;
			position: relative;

			p {
				position: relative;
			}

			&_error {
				color: red;
				font-size: 1rem;
				position: absolute;
				top: 1rem;
				left: 0;

				&:before {
					content: '●';
					display: inline-block;
					margin-right: 0.25rem;
				}
			}
			&_action {
				position: absolute;
				width: 2rem;
				height: 2rem;
				display: block;
				right: -1.6rem;
				top: 0;
				font-size: 1.3rem;
				line-height: 2rem;
			}
			&_result {
				color: orange;
			}
		}
		&__input {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			grid-gap: 0.8rem;
			justify-content: center;
			align-items: center;
		}
	}
	button {
		display: block;
		border-radius: 1rem;
		font-size: inherit;
		width: 100%;
		height: 3rem;
		border: none;
		margin: auto;
		background-color: rgba(#fff, 0.2);
		color: inherit;
		transition: all 0.25s ease;
		cursor: pointer;

		&:hover,
		&:active {
			background-color: rgba(#fff, 0.4);
		}
	}
	.btn-wide {
		grid-column: span 2;
	}
	.btn-operation {
		background-color: orange;

		&:hover,
		&:active {
			background-color: #fff;
			color: #000;
		}
	}
	.btn-special {
		background-color: rgba(#fff, 0.7);
		color: #000;

		&:hover,
		&:active {
			background-color: #fff;
		}
	}

	.fade {
		opacity: 0.6;
	}
</style>
