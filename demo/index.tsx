import React, { useCallback, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"

import {
	Editor,
	Factory,
	Graph,
	Schema,
	Blocks,
	GetSchema,
	makeReducer,
	EditorAction,
	Viewer,
} from ".."

const main = document.querySelector("main")

const blocks = {
	source: Factory.block({
		name: "Collection Export",
		inputs: { a: null, b: null },
		outputs: { outA: null, outB: null },
		backgroundColor: "lavender",
	}),
	fdjsalfj: Factory.block({
		name: "CSV Import",
		inputs: { a: null },
		outputs: { outA: null, outB: null, outC: null },
		backgroundColor: "darksalmon",
	}),
}

function Index<S extends Schema>({
	blocks,
	initialState,
}: {
	blocks: Blocks<S>
	initialState: Graph<S>
}) {
	const [graph, setGraph] = useState(initialState)

	const graphRef = useRef<Graph<S>>(graph)
	graphRef.current = graph

	const reducer = useMemo(() => makeReducer(blocks, initialState), [])
	const dispatch = useCallback(
		(action: EditorAction<S>) => setGraph(reducer(graphRef.current, action)),
		[]
	)

	const handleFocus = useCallback(
		(id: string | null) => console.log("focus", id),
		[]
	)

	return (
		<Editor<S>
			blocks={blocks}
			graph={graph}
			dispatch={dispatch}
			onFocus={handleFocus}
			decorateNodes={(nodes) =>
				nodes
					.filter('[data-id="b"]')
					.attr("stroke-width", 3)
					.attr("stroke", "firebrick")
			}
		/>
	)
}

type S = GetSchema<typeof blocks>

ReactDOM.render(
	<Index<S>
		blocks={blocks}
		initialState={{
			nodes: {
				a: {
					id: "a",
					kind: "fdjsalfj",
					position: { x: 1, y: 1 },
					inputs: { a: null },
					outputs: { outA: [], outB: ["b"], outC: [] },
				},
				b: {
					id: "b",
					kind: "source",
					position: { x: 5, y: 3 },
					inputs: { a: null, b: "c" },
					outputs: { outA: [], outB: [] },
				},
			},
			edges: {
				c: {
					id: "c",
					source: { id: "a", output: "outB" },
					target: { id: "b", input: "b" },
				},
			},
		}}
	/>,
	main
)
