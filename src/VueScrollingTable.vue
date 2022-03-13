<template>
	<table ref="table" class="scrolling" :class="{ scrolly: scrollVertical, scrollx: scrollHorizontal }">
		<thead
			name="thead"
			ref="thead"
			:class="{ scrollsync: syncHeaderScroll, 'scroll-vertical': scrollVertical }"
			@dragenter="onDragEnterHeader"
			@dragover.prevent="onDragOverHeader"
			@drop="onDropHeader"
		>
			<slot name="thead" />
		</thead>
		<tbody name="tbody" ref="tbody" @scroll.passive="updateSyncedScroll">
			<slot name="tbody" />
		</tbody>
		<tfoot name="tfoot" ref="tfoot" v-if="includeFooter" :class="{ scrollsync: syncFooterScroll, 'scroll-vertical': scrollVertical }">
			<slot name="tfoot" />
		</tfoot>
	</table>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"

const props = defineProps({
	deadAreaColor: { type: String, required: false, default: "#CCC" },
	includeFooter: { type: Boolean, required: false, default: false },
	syncHeaderScroll: { type: Boolean, required: false, default: true },
	syncFooterScroll: { type: Boolean, required: false, default: true },
	scrollHorizontal: { type: Boolean, required: false, default: true },
	scrollVertical: { type: Boolean, required: false, default: true },
})

const emit = defineEmits(["header-dragenter", "header-dragover", "header-drop", "scroll"])

const onDragEnterHeader = (e: DragEvent): void => emit("header-dragenter", e)
const onDragOverHeader = (e: DragEvent): void => emit("header-dragover", e)
const onDropHeader = (e: DragEvent): void => emit("header-drop", e)

const table = ref(null)
const tbody = ref(null)
const thead = ref(null)
const tfoot = ref(null)

const updateSyncedScroll = (): void => {
	const l = tbody.value.scrollLeft
	if (props.scrollHorizontal) {
		if (props.syncHeaderScroll && thead.value.scrollLeft !== l) {
			thead.value.scrollLeft = l
		}
		if (props.includeFooter && props.syncFooterScroll && tfoot.value.scrollLeft !== l) {
			tfoot.value.scrollLeft = l
		}
	}
	emit("scroll", tbody.value.scrollTop, l, tbody.value.scrollHeight, tbody.value.scrollWidth)
}

onMounted(() => {
	updateSyncedScroll()
})
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
	--dead-area-color: v-bind(deadAreaColor);
	background-color: var(--dead-area-color);
}

table.scrolling thead,
table.scrolling tfoot {
	/* Fit content, don't shrink it proportionately to the body. */
	flex: 0 0 auto;
	display: block;

	/* Horizontal scrolling, when allowed, is controlled by JS, not a scroll bar. */
	overflow: hidden;
}

table.scrolling tbody {
	display: block;
	flex: 1 1 auto;

	/* Disable all scrolling by default */
	overflow: hidden;
}

/* Turn on horizontal scrolling for the body only */
table.scrolling.scrollx tbody {
	overflow-x: scroll;
}

/* Turn on vertical scrolling for all elements so scroll bars take up the same space */
table.scrolling.scrolly tbody,
table.scrolling.scrolly thead.scrollsync,
table.scrolling.scrolly tfoot.scrollsync {
	overflow-y: scroll;
}

.scroll-vertical.scrollsync {
	background-color: var(--dead-area-color);
	scrollbar-base-color: var(--dead-area-color);
	scrollbar-face-color: var(--dead-area-color);
	scrollbar-highlight-color: var(--dead-area-color);
	scrollbar-track-color: var(--dead-area-color);
	scrollbar-arrow-color: var(--dead-area-color);
	scrollbar-shadow-color: var(--dead-area-color);
	scrollbar-darkshadow-color: var(--dead-area-color);
}

/*
For Webkit, use "dead area" color to hide vertical scrollbar functions in the header and footer.
Since WebKit supports CSS variables and style attributes don't support pseudo-classes, use variables.
Display is set because otherwise Chrome ignores the other styling.
TODO: on Chrome/Safari for Mac, scrollbars are not shown anyway and this creates an extra block. No impact on iOS Safari.
*/
table.scrolling.scrolly thead.scrollsync::-webkit-scrollbar {
	display: block;
	background-color: var(--dead-area-color);
}

table.scrolling.scrolly thead.scrollsync::-webkit-scrollbar-track {
	background-color: var(--dead-area-color);
}

/* The one caveat to scrolling this way: a hard-set width is required. Can override in thead/tbody slot. */
table.scrolling td,
table.scrolling th {
	/* These must all be set the same in your overriding CSS */
	width: 10em;
	min-width: 10em;
	max-width: 10em;

	/* Important in case your data is too long for your cell */
	overflow: hidden;
	word-wrap: break-word;
}

/* Default formatting, easy to override. */

:where(table.scrolling td) {
	background-color: #fff;
	border: 1px solid #ddd;
}

:where(table.scrolling th) {
	background-color: #f7f7f7;
	border: 1px solid #ddd;
}
</style>
