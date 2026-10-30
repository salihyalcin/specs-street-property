/**
 * StreetPropertyOverlayUI — passive world-space view for the cluster, apartment
 * markers, connector, and listing card. It emits user intent and renders data
 * pushed by StreetPropertyMain; it must not own recognition or domain state.
 *
 * This generated UIKit module is intentionally long because it contains the
 * complete, self-contained UI composition surface and its layout helpers.
 */
import {Button} from "SpectaclesUIKit.lspkg/Scripts/Components/Button/Button"
import {Frame} from "SpectaclesUIKit.lspkg/Scripts/Components/Frame/Frame"
import {BackPlate} from "SpectaclesUIKit.lspkg/Scripts/BackPlate"
import {FlexLayout} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexLayout"
import {FlexItem} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexItem"
import {
  FlexAlign,
  FlexAlignSelf,
  FlexDirection,
  FlexJustify,
} from "SpectaclesUIKit.lspkg/Scripts/Components/Layout2D/Flex/FlexTypes"
import animate from "SpectaclesInteractionKit.lspkg/Utils/animate"
import Event, {PublicApi} from "SpectaclesInteractionKit.lspkg/Utils/Event"
import {StreetPropertyListing} from "./StreetPropertyListings"

const FOCAL_DISTANCE_CM = 800
const CONTENT_Z = 0.6
const BUTTON_LABEL_Z = 0.08

type TextRole = "Title1" | "Subheadline" | "Body" | "Caption"
const TYPE_SCALE: Record<TextRole, {size: number; weight: number}> = {
  Title1: {size: 105, weight: 700},
  Subheadline: {size: 41, weight: 700},
  Body: {size: 39, weight: 500},
  Caption: {size: 38, weight: 500},
}

function applyTextRole(text: Text, role: TextRole): void {
  text.size = TYPE_SCALE[role].size * (FOCAL_DISTANCE_CM / 110)
  ;(text as Text & {weight?: number}).weight = TYPE_SCALE[role].weight
}

@component
export class StreetPropertyOverlayUI extends BaseScriptComponent {
  @ui.label('<span style="color: #60A5FA;">StreetPropertyOverlayUI – façade overlay</span>')
  @ui.separator
  @ui.group_start("Settings")
  @input
  @hint("Diameter of the collapsed availability cluster in centimeters")
  @widget(new SliderWidget(24, 50, 1))
  clusterDiameterCm: number = 35

  @input
  @hint("Diameter of each apartment marker in centimeters")
  @widget(new SliderWidget(20, 45, 1))
  markerDiameterCm: number = 30

  @input
  @hint("Width of the listing card in centimeters")
  @widget(new SliderWidget(80, 140, 1))
  cardWidthCm: number = 112

  @input
  @hint("Height of the listing card in centimeters")
  @widget(new SliderWidget(52, 90, 1))
  cardHeightCm: number = 76

  @input
  @hint("Duration of the cluster-to-apartment scatter animation in seconds")
  @widget(new SliderWidget(0.15, 1.2, 0.05))
  scatterDurationSec: number = 0.45

  @input
  @hint("Thickness of the visible line connecting a marker to the card")
  @widget(new SliderWidget(1, 6, 0.5))
  connectorThicknessCm: number = 2.5
  @ui.group_end

  private readonly _onClusterPressed = new Event<void>()
  private readonly _onListingPressed = new Event<number>()
  private readonly _onClosePressed = new Event<void>()

  get onClusterPressed(): PublicApi<void> { return this._onClusterPressed.publicApi() }
  get onListingPressed(): PublicApi<number> { return this._onListingPressed.publicApi() }
  get onClosePressed(): PublicApi<void> { return this._onClosePressed.publicApi() }

  private uiLayer!: SceneObject
  private clusterRoot!: SceneObject
  private markerRoots: SceneObject[] = []
  private markerTargets: vec3[] = [
    new vec3(-150, 50, 0),
    new vec3(110, 200, 0),
    new vec3(-60, 350, 0),
  ]
  private readonly clusterPosition = new vec3(-33.333, 200, 0)
  private readonly cardPositions: vec3[] = [
    new vec3(-25, 90, 2),
    new vec3(-15, 215, 2),
    new vec3(55, 340, 2),
  ]

  private connectorRoot!: SceneObject
  private connectorPlate!: BackPlate
  private cardRoot!: SceneObject
  private cardReady: boolean = false
  private statusText!: Text
  private roomsText!: Text
  private floorText!: Text
  private bathroomsText!: Text
  private priceText!: Text

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => {
      this.sceneObject.createComponent("Component.Canvas")
      this.uiLayer = this.makeObject(this.sceneObject, "StreetPropertyUILayer")
      this.buildCluster()
      this.buildApartmentMarkers()
      this.buildConnector()
      this.buildListingCard()
    })
  }

  showCollapsed(): void {
    this.uiLayer.enabled = true
    this.clusterRoot.enabled = true
    this.markerRoots.forEach((root) => { root.enabled = false })
    this.hideListing()
  }

  showApartmentMarkers(): void {
    this.uiLayer.enabled = true
    this.clusterRoot.enabled = false
    this.hideListing()
    for (let i = 0; i < this.markerRoots.length; i++) {
      const root = this.markerRoots[i]
      const start = this.clusterPosition
      const end = this.markerTargets[i]
      root.enabled = true
      root.getTransform().setLocalPosition(start)
      animate({
        duration: this.scatterDurationSec,
        easing: "ease-out-back",
        update: (t: number) => {
          root.getTransform().setLocalPosition(new vec3(
            start.x + (end.x - start.x) * t,
            start.y + (end.y - start.y) * t,
            end.z,
          ))
        },
      })
    }
  }

  showListing(index: number, listing: StreetPropertyListing): void {
    if (!this.cardReady || index < 0 || index >= this.markerRoots.length) {
      return
    }
    this.statusText.text = listing.status
    this.roomsText.text = listing.rooms
    this.floorText.text = `Floor ${listing.floor}`
    this.bathroomsText.text = listing.bathrooms
    this.priceText.text = listing.price
    this.cardRoot.getTransform().setLocalPosition(this.cardPositions[index])
    this.updateConnector(index)
    this.connectorRoot.enabled = true
    this.cardRoot.enabled = true
  }

  hideListing(): void {
    if (this.cardRoot) this.cardRoot.enabled = false
    if (this.connectorRoot) this.connectorRoot.enabled = false
  }

  hideAll(): void {
    this.clusterRoot.enabled = false
    this.markerRoots.forEach((root) => { root.enabled = false })
    this.hideListing()
    this.uiLayer.enabled = false
  }

  private buildCluster(): void {
    this.clusterRoot = this.makeObject(this.uiLayer, "StreetPropertyClusterMarker", this.clusterPosition)
    const button = this.makeMarkerButton(this.clusterRoot, this.clusterDiameterCm)
    this.addRoundButtonLabel(this.clusterRoot, "3", this.clusterDiameterCm, "Title1")
    button.onTriggerUp.add(() => this._onClusterPressed.invoke())
  }

  private buildApartmentMarkers(): void {
    const floors = [1, 3, 8]
    for (let i = 0; i < floors.length; i++) {
      const root = this.makeObject(this.uiLayer, `StreetPropertyMarkerFloor${floors[i]}`, this.clusterPosition)
      const button = this.makeMarkerButton(root, this.markerDiameterCm)
      this.addRoundButtonLabel(root, `${floors[i]}`, this.markerDiameterCm, "Title1")
      button.onTriggerUp.add(() => this._onListingPressed.invoke(i))
      button.onInitialized.add(() => { root.enabled = false })
      this.markerRoots.push(root)
    }
  }

  private makeMarkerButton(parent: SceneObject, diameter: number): Button {
    const button = parent.createComponent(Button.getTypeName()) as Button
    button.setVariant({theme: "SnapOS3", shape: "Round", style: "Primary"})
    button.size = new vec3(diameter, diameter, 1)
    return button
  }

  private buildConnector(): void {
    this.connectorRoot = this.makeObject(this.uiLayer, "StreetPropertyConnectorLine")
    this.connectorPlate = this.connectorRoot.createComponent(BackPlate.getTypeName()) as BackPlate
    this.connectorPlate.style = "simple"
  }

  private buildListingCard(): void {
    this.cardRoot = this.makeObject(this.uiLayer, "StreetPropertyListingCard")
    const frame = this.cardRoot.createComponent(Frame.getTypeName()) as Frame
    frame.autoShowHide = false
    frame.autoScaleContent = false
    frame.allowScaling = false

    frame.onInitialized.add(() => {
      frame.innerSize = new vec2(this.cardWidthCm, this.cardHeightCm)
      frame.padding = new vec2(3, 3)

      const content = this.makeObject(frame.contentTransform.getSceneObject(), "StreetPropertyCardContent", new vec3(0, 0, CONTENT_Z))
      const column = content.createComponent(FlexLayout.getTypeName()) as FlexLayout
      column.autoDiscoverItemsOnStart = false
      column.width = this.cardWidthCm
      column.height = this.cardHeightCm
      column.direction = FlexDirection.Column
      column.alignItems = FlexAlign.Stretch
      column.justifyContent = FlexJustify.Center
      column.rowGap = 1
      column.paddingTop = 3
      column.paddingBottom = 3
      column.paddingLeft = 5
      column.paddingRight = 5

      this.statusText = this.addCardRow(content, "StreetPropertyStatusText", "FOR SALE", "Subheadline", 8)
      this.roomsText = this.addCardRow(content, "StreetPropertyRoomsText", "3 rooms", "Body", 6.5)
      this.floorText = this.addCardRow(content, "StreetPropertyFloorText", "Floor 1", "Body", 6.5)
      this.bathroomsText = this.addCardRow(content, "StreetPropertyBathroomsText", "2 bathrooms", "Body", 6.5)
      this.priceText = this.addCardRow(content, "StreetPropertyPriceText", "$1,250,000", "Subheadline", 8)
      this.addCloseButton(content, column)

      this.cardReady = true
      this.connectorRoot.enabled = false
      this.cardRoot.enabled = false
    })
  }

  private addCardRow(parent: SceneObject, name: string, initial: string, role: TextRole, height: number): Text {
    const row = this.makeObject(parent, name)
    const text = row.createComponent("Component.Text") as Text
    text.text = initial
    text.depthTest = true
    text.textFill.color = new vec4(1, 1, 1, 1)
    applyTextRole(text, role)
    text.horizontalAlignment = HorizontalAlignment.Center
    text.verticalAlignment = VerticalAlignment.Center
    text.horizontalOverflow = HorizontalOverflow.Overflow
    text.verticalOverflow = VerticalOverflow.Overflow
    text.layoutRect = Rect.create(-0.5, 0.5, -0.5, 0.5)
    const item = row.createComponent(FlexItem.getTypeName()) as FlexItem
    item.alignSelf = FlexAlignSelf.Stretch
    item.overrideHeight = height
    const layout = parent.getComponent(FlexLayout.getTypeName()) as FlexLayout
    layout.addItems([item])
    return text
  }

  private addCloseButton(parent: SceneObject, column: FlexLayout): void {
    const row = this.makeObject(parent, "StreetPropertyCloseRow")
    const item = row.createComponent(FlexItem.getTypeName()) as FlexItem
    item.alignSelf = FlexAlignSelf.Center
    item.overrideWidth = 28
    item.overrideHeight = 11

    const buttonRoot = this.makeObject(row, "StreetPropertyCloseButton")
    const button = buttonRoot.createComponent(Button.getTypeName()) as Button
    button.setVariant({theme: "SnapOS3", shape: "Capsule", style: "Primary"})
    button.size = new vec3(28, 10, 1)

    const labelRoot = this.makeObject(buttonRoot, "StreetPropertyCloseLabel", new vec3(0, 0, BUTTON_LABEL_Z))
    const label = labelRoot.createComponent("Component.Text") as Text
    label.text = "CLOSE"
    label.depthTest = true
    label.textFill.color = new vec4(1, 1, 1, 1)
    label.outlineSettings.enabled = true
    label.outlineSettings.fill.color = new vec4(0.05, 0.05, 0.08, 1)
    label.outlineSettings.size = 0.25
    applyTextRole(label, "Body")
    label.horizontalAlignment = HorizontalAlignment.Center
    label.verticalAlignment = VerticalAlignment.Center
    label.horizontalOverflow = HorizontalOverflow.Overflow
    label.verticalOverflow = VerticalOverflow.Overflow
    label.layoutRect = Rect.create(-14, 14, -5, 5)

    button.onTriggerUp.add(() => this._onClosePressed.invoke())
    column.addItems([item])
  }

  private addRoundButtonLabel(parent: SceneObject, value: string, diameter: number, role: TextRole): void {
    const labelRoot = this.makeObject(parent, `${parent.name}Label`, new vec3(0, 0, BUTTON_LABEL_Z))
    const text = labelRoot.createComponent("Component.Text") as Text
    text.text = value
    text.depthTest = true
    text.textFill.color = new vec4(1, 1, 1, 1)
    text.outlineSettings.enabled = true
    text.outlineSettings.fill.color = new vec4(0.05, 0.05, 0.08, 1)
    text.outlineSettings.size = 0.35
    text.backgroundSettings.enabled = true
    text.backgroundSettings.fill.color = new vec4(1, 0.25, 0.03, 1)
    text.backgroundSettings.margins = Rect.create(4, 4, 4, 4)
    text.backgroundSettings.cornerRadius = diameter * 0.5
    applyTextRole(text, role)
    text.horizontalAlignment = HorizontalAlignment.Center
    text.verticalAlignment = VerticalAlignment.Center
    text.horizontalOverflow = HorizontalOverflow.Overflow
    text.verticalOverflow = VerticalOverflow.Overflow
    text.layoutRect = Rect.create(-diameter / 2, diameter / 2, -diameter / 2, diameter / 2)
  }

  private updateConnector(index: number): void {
    const marker = this.markerTargets[index]
    const card = this.cardPositions[index]
    const cardOnRight = card.x >= marker.x
    const startX = marker.x + (cardOnRight ? this.markerDiameterCm * 0.5 : -this.markerDiameterCm * 0.5)
    const endX = card.x + (cardOnRight ? -this.cardWidthCm * 0.5 : this.cardWidthCm * 0.5)
    const start = new vec2(startX, marker.y)
    const end = new vec2(endX, card.y)
    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx)
    this.connectorPlate.size = new vec2(length, this.connectorThicknessCm)
    this.connectorRoot.getTransform().setLocalPosition(new vec3((start.x + end.x) * 0.5, (start.y + end.y) * 0.5, 1))
    this.connectorRoot.getTransform().setLocalRotation(quat.fromEulerAngles(0, 0, angle))
  }

  private makeObject(parent: SceneObject, name: string, position?: vec3): SceneObject {
    const object = global.scene.createSceneObject(name)
    object.setParent(parent)
    if (position) object.getTransform().setLocalPosition(position)
    return object
  }
}
