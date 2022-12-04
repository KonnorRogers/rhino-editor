class DocLinks < Bridgetown::Component
  def initialize(category:, link_classes: nil, list_classes: nil)
    @category = category
    @list_classes = list_classes
    @link_classes = link_classes
  end

  def collection
    sorted_collection.select { |doc| doc.data[:categories].include?(@category) }
  end
end
