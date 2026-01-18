import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.accounts import Accounts

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class AccountsService:
    """Service layer for Accounts operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Accounts]:
        """Create a new accounts"""
        try:
            obj = Accounts(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created accounts with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating accounts: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Accounts]:
        """Get accounts by ID"""
        try:
            query = select(Accounts).where(Accounts.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching accounts {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of accountss"""
        try:
            query = select(Accounts)
            count_query = select(func.count(Accounts.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Accounts, field):
                        query = query.where(getattr(Accounts, field) == value)
                        count_query = count_query.where(getattr(Accounts, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Accounts, field_name):
                        query = query.order_by(getattr(Accounts, field_name).desc())
                else:
                    if hasattr(Accounts, sort):
                        query = query.order_by(getattr(Accounts, sort))
            else:
                query = query.order_by(Accounts.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching accounts list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Accounts]:
        """Update accounts"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Accounts {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated accounts {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating accounts {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete accounts"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Accounts {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted accounts {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting accounts {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Accounts]:
        """Get accounts by any field"""
        try:
            if not hasattr(Accounts, field_name):
                raise ValueError(f"Field {field_name} does not exist on Accounts")
            result = await self.db.execute(
                select(Accounts).where(getattr(Accounts, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching accounts by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Accounts]:
        """Get list of accountss filtered by field"""
        try:
            if not hasattr(Accounts, field_name):
                raise ValueError(f"Field {field_name} does not exist on Accounts")
            result = await self.db.execute(
                select(Accounts)
                .where(getattr(Accounts, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Accounts.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching accountss by {field_name}: {str(e)}")
            raise