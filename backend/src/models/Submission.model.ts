import { Schema, model, InferSchemaType } from "mongoose";
import { ROUNDS } from "./GameRoom.model";

// what one player picked in one round. Votes are secret, so don't send these to other players
const submissionSchema = new Schema(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: "GameRoom",
      required: [true, 'Room is required.']
    },
    round: {
      type: String,
      enum: ROUNDS,
      required: [true, 'Round is required.']
    },
    player: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'Player is required.']
    },
    // the movies the player picked. points are only used in the hype round
    choices: {
      type: [
        {
          _id: false,
          movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: [true, 'Movie is required.']
          },
          points: {
            type: Number,
            min: [0, 'Points cannot be negative.'],
            default: 0
          }
        }
      ],
      default: []
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true
  }
);

// a player can only submit once per round in a room
submissionSchema.index({ room: 1, round: 1, player: 1 }, { unique: true });

export type ISubmission = InferSchemaType<typeof submissionSchema>;

const Submission = model("Submission", submissionSchema);

export default Submission;
