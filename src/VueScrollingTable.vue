<template>
	<table class="scrolling" :style="tableStyle" ref="table">
		<thead name="thead" :style="headStyle" ref="thead"><slot name="thead"/></thead>
		<tbody name="tbody" @scroll="syncTHeadScroll" ref="tbody"><slot name="tbody"/></tbody>
		<tfoot name="tfoot" v-if="includeFooter"><slot name="tfoot"/></tfoot>
	</table>
</template>
<script>
export default {
	name: "VueScrollingTable",
	props: {
		deadAreaColor: { type: String, required: false, default: "#CCC" },
		includeFooter: { type: Boolean, required: false, default: false },
	},
	computed: {
		tableStyle() {
			return `background-color: ${this.deadAreaColor};`
		},
		headStyle() {
			return `background-color: ${this.deadAreaColor};
				scrollbar-base-color: ${this.deadAreaColor};
				scrollbar-face-color: ${this.deadAreaColor};
				scrollbar-highlight-color: ${this.deadAreaColor};
				scrollbar-track-color: ${this.deadAreaColor};
				scrollbar-arrow-color: ${this.deadAreaColor};
				scrollbar-shadow-color: ${this.deadAreaColor};
				scrollbar-darkshadow-color: ${this.deadAreaColor};`
		},
	},
	watch: {
		deadAreaColor() {
			this.setColors()
		},
	},
	mounted: function() {
		this.setColors()
		this.syncTHeadScroll()
	},
	methods: {
		syncTHeadScroll() {
			const h = this.$refs.thead
			const l = this.$refs.tbody.scrollLeft
			if (h.scrollLeft !== l) {
				h.scrollLeft = l
			}
		},
		setColors() {
			const s = this.$refs.table.style
			s.setProperty("--dead-area-color", this.deadAreaColor)
		},
	},
}
</script>
<style>
table.scrolling {
	display: flex;
	flex-direction: column;
	flex: 1 1 auto;
	width: 100%;
	height: 100%;
	border-collapse: collapse;
	overflow: hidden;
	/* Use this to create a "dead" area color if table is too wide for cells */
	background-color: #ccc;
	--dead-area-color: #ccc;
}

table.scrolling thead {
	/* Grow thead automatically to fit content, don't shrink it proportionately to the body. */
	flex: 1 0 auto;
	display: block;
	/* x-scrolling will be managed via JS */
	overflow-x: hidden;
	/* Keep header columns aligned with useless scrollbar. For IE11, use "dead area" color to hide scrollbar functions */
	overflow-y: scroll;
}

/*
For Webkit, use "dead area" color to hide scrollbar functions.
Since WebKit supports CSS variables and style attributes don't support pseudo-classes, use variables.
Display is set because otherwise Chrome ignores the other styling.
TODO: on Chrome/Safari for Mac, scrollbars are not shown anyway and this creates an extra block. No impact on iOS Safari.
*/
table.scrolling thead::-webkit-scrollbar {
	display: block;
	background-color: var(--dead-area-color);
}
table.scrolling thead::-webkit-scrollbar-track {
	background-color: var(--dead-area-color);
}

/* Scroll the actual tbody (second child on all browsers) */
table.scrolling tbody {
	display: block;
	overflow: scroll;
}

/* IE11 adds an extra tbody, have to hide it */
table.scrolling tbody:nth-child(3) {
	display: none;
}

/* The one caveat to scrolling this way: a hard-set width is required. Can override in thead/tbody slot. */
table.scrolling td,
table.scrolling th {
	border: 1px solid #ddd;

	/* These must all be set the same in your overriding CSS */
	width: 10em;
	min-width: 10em;
	max-width: 10em;

	/* Important in case your data is too long for your cell */
	overflow: hidden;
	word-wrap: break-word;
}

table.scrolling td {
	background-color: #fff;
}

table.scrolling th {
	background-color: #f7f7f7;
}

table.scrolling tfoot {
	/* Grow tfoot automatically to fit content, don't shrink it proportionately to the body. */
	flex: 1 0 auto;
	display: block;
	overflow: hidden;
}
</style>