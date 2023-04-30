require "y-rb"
require "y-rb_actioncable"
class SyncChannel < ApplicationCable::Channel
  include ::Y::Actioncable::Sync

  def subscribed
    # initiate sync & subscribe to updates, with optional persistence mechanism
    sync_for("SyncChannel")
  end

  def receive(message)
    # broadcast update to all connected clients on all servers
    sync_to("SyncChannel", message)
  end
end
