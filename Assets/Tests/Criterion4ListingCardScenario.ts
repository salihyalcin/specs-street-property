import {Scenario} from "Leaf.lspkg/Scenarios/scenario/Scenario"
import {expect} from "Leaf.lspkg/Utils/common/Expect"
import {sleep} from "Leaf.lspkg/Utils/common/Utils"
import {expandWithDefaultInteractor, requiredInteractable, requiredObject, requiredText, waitForStartup} from "./StreetPropertyLeafHelpers"

@component
export class Criterion4ListingCardScenario extends Scenario {
  async run(): Promise<void> {
    await waitForStartup()
    const interactor = await expandWithDefaultInteractor()
    await interactor.trigger(requiredInteractable("StreetPropertyMarkerFloor1"))
    await sleep(250)
    expect(requiredObject("StreetPropertyListingCard").isEnabledInHierarchy).toBe(true)
    expect(requiredObject("StreetPropertyConnectorLine").isEnabledInHierarchy).toBe(true)
    expect(requiredText("StreetPropertyStatusText")).toBe("FOR SALE")
    expect(requiredText("StreetPropertyRoomsText")).toBe("3 rooms")
    expect(requiredText("StreetPropertyFloorText")).toBe("Floor 1")
    expect(requiredText("StreetPropertyBathroomsText")).toBe("2 bathrooms")
    expect(requiredText("StreetPropertyPriceText")).toBe("$780,000")
  }
}
