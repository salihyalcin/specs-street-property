import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {requiredObject, requiredText, waitForStartup} from "./StreetPropertyLeafHelpers"

@component
export class Criterion1BuildingScenario extends Scenario {
  async run(): Promise<void> {
    await waitForStartup()
    const building = requiredObject("StreetPropertyBuilding")
    const transform = building.getTransform()
    const position = transform.getWorldPosition()
    const scale = transform.getWorldScale()
    expect(building.isEnabledInHierarchy, "Building should render at startup").toBe(true)
    expect(building.getComponent("Component.RenderMeshVisual"), "Building must be a solid mesh").toBeTruthy()
    expect(position.z, "Building must sit at z=-800cm").toBeCloseTo(-800, 2)
    expect(scale.x, "Building width must be 600cm").toBeCloseTo(600, 2)
    expect(scale.y, "Building height must be 900cm").toBeCloseTo(900, 2)
    expect(requiredText("StreetPropertyClusterMarkerLabel")).toBe("3")

    const cluster = requiredObject("StreetPropertyClusterMarker")
    const camera = requiredObject("Camera Object")
    const interactionDistance = cluster.getTransform().getWorldPosition()
      .distance(camera.getTransform().getWorldPosition())
    expect(
      interactionDistance < 500,
      "The cluster must start inside SIK's 500cm mouse/hand raycast range",
    ).toBe(true)
  }
}
