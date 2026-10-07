from database import SessionLocal, engine, Base
import models
from datetime import datetime, timedelta

Base.metadata.create_all(bind=engine)
db = SessionLocal()

db.query(models.Meeting).delete()

m1 = models.Meeting(
    title="Engineering Sync - Q4 Infrastructure & System Design",
    date=datetime.now() - timedelta(hours=3),
    duration_seconds=340,
    participants="Alex Rivera, Sarah Chen, Arpit Anand",
    audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    summary="The engineering team discussed high-scale microservices migration, caching layers using Redis, and database indexing strategies for optimal throughput. Finalized timelines for Q4 release.",
    topics="Architecture, Microservices, Caching, DB Schema"
)

m2 = models.Meeting(
    title="Product Design Critique - Fireflies UX Revamp",
    date=datetime.now() - timedelta(days=1),
    duration_seconds=210,
    participants="David Kim, Elena Rostova, Marcus Vance",
    audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    summary="Reviewed modern sidebar navigation, dark theme color palettes, interactive transcript hover effects, and audio wave seeking controls.",
    topics="UI/UX, Visual Design, Accessibility, Interactive Waveforms"
)

db.add_all([m1, m2])
db.commit()

# Seed Transcripts for M1
t_m1 = [
    models.TranscriptSegment(meeting_id=m1.id, speaker="Alex Rivera", start_time=0.0, end_time=12.0, text="Hey team, welcome to the Q4 architecture review. Let's start with database scalability."),
    models.TranscriptSegment(meeting_id=m1.id, speaker="Sarah Chen", start_time=12.5, end_time=28.0, text="I've benchmarked PostgreSQL and SQLite for local caching. PostgreSQL handles our high concurrent write throughput much better."),
    models.TranscriptSegment(meeting_id=m1.id, speaker="Arpit Anand", start_time=28.5, end_time=50.0, text="Agreed. We should also enforce foreign key constraints on the transcript segments to prevent orphaned records."),
    models.TranscriptSegment(meeting_id=m1.id, speaker="Alex Rivera", start_time=50.5, end_time=75.0, text="Sounds great. Sarah, can you lead the schema migration PR by Thursday?")
]

# Seed Action Items for M1
a_m1 = [
    models.ActionItem(meeting_id=m1.id, text="Draft database migration scripts for PostgreSQL", assignee="Sarah Chen", completed=False),
    models.ActionItem(meeting_id=m1.id, text="Set up Redis cache cluster for transcript search index", assignee="Arpit Anand", completed=True),
    models.ActionItem(meeting_id=m1.id, text="Schedule follow-up review with DevOps lead", assignee="Alex Rivera", completed=False)
]

db.add_all(t_m1 + a_m1)
db.commit()
db.close()
print("Database seeded successfully with Fireflies demo data!")