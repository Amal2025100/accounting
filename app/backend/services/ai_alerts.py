import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.ai_alerts import Ai_alerts

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Ai_alertsService:
    """Service layer for Ai_alerts operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Ai_alerts]:
        """Create a new ai_alerts"""
        try:
            obj = Ai_alerts(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created ai_alerts with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating ai_alerts: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Ai_alerts]:
        """Get ai_alerts by ID"""
        try:
            query = select(Ai_alerts).where(Ai_alerts.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching ai_alerts {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of ai_alertss"""
        try:
            query = select(Ai_alerts)
            count_query = select(func.count(Ai_alerts.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Ai_alerts, field):
                        query = query.where(getattr(Ai_alerts, field) == value)
                        count_query = count_query.where(getattr(Ai_alerts, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Ai_alerts, field_name):
                        query = query.order_by(getattr(Ai_alerts, field_name).desc())
                else:
                    if hasattr(Ai_alerts, sort):
                        query = query.order_by(getattr(Ai_alerts, sort))
            else:
                query = query.order_by(Ai_alerts.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching ai_alerts list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Ai_alerts]:
        """Update ai_alerts"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Ai_alerts {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated ai_alerts {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating ai_alerts {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete ai_alerts"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Ai_alerts {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted ai_alerts {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting ai_alerts {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Ai_alerts]:
        """Get ai_alerts by any field"""
        try:
            if not hasattr(Ai_alerts, field_name):
                raise ValueError(f"Field {field_name} does not exist on Ai_alerts")
            result = await self.db.execute(
                select(Ai_alerts).where(getattr(Ai_alerts, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching ai_alerts by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Ai_alerts]:
        """Get list of ai_alertss filtered by field"""
        try:
            if not hasattr(Ai_alerts, field_name):
                raise ValueError(f"Field {field_name} does not exist on Ai_alerts")
            result = await self.db.execute(
                select(Ai_alerts)
                .where(getattr(Ai_alerts, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Ai_alerts.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching ai_alertss by {field_name}: {str(e)}")
            raise